import React, { FC, useEffect, useState } from 'react'
import { Button, Form, Spinner } from 'react-bootstrap'
import { DepartmentApiService } from '../../../../../../api/department/department-api-service'
import { toastErrorBounceDark, toastSuccessBounceDark } from '../../../../../../utils/toast'

type Consultant = {
  consultantId: number
  consultantName: string
  departmentId?: number
  departmentName?: string
//   userId?: number
  particularId?: number
  groupId?: number,
  consultationCharge?: number
}

type Props = {
  onClose: () => void
  onTransfer?: (consultant: Consultant) => void
}

const deptService = new DepartmentApiService()

type ExtraProps = Props & { patientDetails?: any }

const DoctorTransfer: FC<ExtraProps> = ({ onClose, onTransfer, patientDetails }) => {
  const [consultants, setConsultants] = useState<Consultant[]>([])
  const [selectedId, setSelectedId] = useState<number>(0)
  const [transfers, setTransfers] = useState<any[]>([])
  const [selectedTransferId, setSelectedTransferId] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [saving, setSaving] = useState<boolean>(false)

  const fetchConsultants = async () => {
    try {
      setLoading(true)
      const resp: any = await deptService.fetchAllConsultantDetails()
      if (Array.isArray(resp)) setConsultants(resp)
      else setConsultants([])
    } catch (err) {
      console.error(err)
      toastErrorBounceDark('Failed to load doctors')
    } finally {
      setLoading(false)
    }
  }

  const getTransferDate = (t: any) => {
    // Prefer nextReview when it's a meaningful date (not the default '0000-00-00')
    const next = t?.nextReview ?? t?.reviewDate ?? null
    if (next && String(next).trim() && String(next) !== '0000-00-00') {
      const p = Date.parse(String(next))
      if (!Number.isNaN(p)) return p
    }
    // try common date fields, fallback to 0
    const d = t?.transferDate ?? t?.createdOn ?? t?.dateTime ?? t?.createdAt
    const parsed = Date.parse(d ?? '')
    return Number.isNaN(parsed) ? 0 : parsed
  }

  const getIsCompleted = (t: any) => {
    if (t == null) return 0
    if (typeof t.isCompleted !== 'undefined') return Number(t.isCompleted)
    if (typeof t.is_completed !== 'undefined') return Number(t.is_completed)
    // fallback: try status or completed
    if (typeof t.status !== 'undefined') return Number(t.status)
    if (typeof t.completed !== 'undefined') return Number(t.completed)
    return 0
  }

  const getStatusLabel = (t: any) => {
    const s = getIsCompleted(t)
    if (s === 1) return 'Received'
    if (s === 2) return 'Completed'
    return 'Pending'
  }

  const getFromLabel = (t: any) => {
    if (t == null) return 'Unknown'
    // if fromDoctor is explicitly null, show REGISTRATION
    if (t.fromDoctor === null || typeof t.fromDoctor === 'undefined') return 'REGISTRATION'
    return t.fromDoctor || 'Unknown'
  }

  const formatDateOnly = (ts: number) => {
    if (!ts) return '-'
    try {
      const d = new Date(ts)
      // return ISO date part (yyyy-mm-dd)
      return d.toISOString().split('T')[0]
    } catch (e) {
      return '-'
    }
  }

  const fetchTransfers = async () => {
    if (!patientDetails || !patientDetails.visitId) return
    try {
      const resp: any = await deptService.fetchDoctorTransfer(patientDetails.visitId)
      if (Array.isArray(resp)) {
        // sort newest first by best-effort date field
        const sorted = resp.slice().sort((a: any, b: any) => getTransferDate(b) - getTransferDate(a))
        setTransfers(sorted)

        if (sorted.length > 0) {
          const recent = sorted[0]
          setSelectedTransferId(recent.transferId ?? recent.id ?? 0)
          // prefer id-based mapping if backend provides toDoc
          if (recent && (recent.toDoc || recent.toDoctor)) {
            const matchById = recent.toDoc ? consultants.find((c) => c.consultantId === Number(recent.toDoc)) : undefined
            if (matchById) setSelectedId(matchById.consultantId)
            else if (recent.toDoctor) {
              const matchByName = consultants.find((c) => c.consultantName === recent.toDoctor)
              setSelectedId(matchByName ? matchByName.consultantId : 0)
            } else setSelectedId(0)
          } else {
            setSelectedId(0)
          }
        } else {
          setSelectedTransferId(0)
        }
      } else setTransfers([])
    } catch (err) {
      console.error(err)
      // don't block the UI for transfers
    }
  }

  useEffect(() => {
    fetchConsultants()
  }, [])

  // when consultants load or patient details change, fetch transfers
  useEffect(() => {
    if (consultants.length > 0 && patientDetails && patientDetails.visitId) {
      fetchTransfers()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultants, patientDetails])

  const handleSave = async () => {
    const selected = consultants.find((c) => c.consultantId === Number(selectedId))
    if (!selected) {
      toastErrorBounceDark('Please select a doctor')
      return
    }
    if (!patientDetails || !patientDetails.patientId) {
      toastErrorBounceDark('Patient details missing')
      return
    }

    const payload = {
      toDoc: selected.consultantId,
      investigationOrders: [
        {
          billId: 0,
          groupId: selected.groupId ?? 0,
          particularId: selected.particularId ?? 0,
          unit: 0,
          rate: selected.consultationCharge ?? 0,
          disc: 0,
          docId: 0,
          returnUnit: 0,
          fcRate: 0,
          patId: patientDetails.patientId,
          vstId: patientDetails.visitId,
          uid: 0,
          dateTime: new Date().toISOString(),
          finalBillId: 0
        }
      ]
    }

    try {
      // prevent creating transfer if any existing transfer already has this toDoc
      if (Array.isArray(transfers) && transfers.some((t) => {
        const toId = t.toDoc ? Number(t.toDoc) : undefined
        const toName = t.toDoctor ?? undefined
        return (toId && toId === selected.consultantId) || (!toId && toName && toName === selected.consultantName)
      })) {
        toastErrorBounceDark(`This patient is already transfered to ${selected.consultantName}`)
        return
      }

      setSaving(true)
      await deptService.saveDoctorTransfer(payload)
      toastSuccessBounceDark(`Doctor transferred to ${selected.consultantName}`)
      if (onTransfer) onTransfer(selected)
      // refresh transfers to include the newly created transfer
      await fetchTransfers()
      onClose()
    } catch (err) {
      console.error(err)
      toastErrorBounceDark('Failed to transfer doctor')
    } finally {
      setSaving(false)
    }
  }
  const handleRemoveFor = async (transferId: number) => {
    if (!transferId) return
    const t = transfers.find((x) => (x.transferId ?? x.id) === transferId)
    if (!t) return
    const status = getIsCompleted(t)
    if (status !== 0) {
      toastErrorBounceDark('Only pending transfers can be removed')
      return
    }
    try {
      setSaving(true)
      const idToRemove = t.transferId ?? t.id
      console.log('removeTransferId', idToRemove)
      await deptService.removeDoctorTransfer(idToRemove)
      toastSuccessBounceDark('Transfer removed')
      // refresh list
      await fetchTransfers()
      setSelectedTransferId(0)
      setSelectedId(0)
    } catch (err) {
      console.error(err)
      toastErrorBounceDark('Failed to remove transfer')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {transfers && transfers.length > 0 && (
        <div className="mb-3">
          <Form.Label className="d-block ">Transfer History</Form.Label>
          <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #e9ecef', borderRadius: 4 }}>
            <table className="table table-sm hover mb-0">
              <thead>
                <tr>
                  <th style={{ width: 40 }}>Sl No</th>
                  <th>From</th>
                  <th>To</th>
                  <th style={{ width: 100 }}>Status</th>
                  <th style={{ width: 160 }}>Date</th>
                  <th style={{ width: 100 }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {transfers.map((t: any, idx: number) => (
                  <tr 
                    key={t.transferId ?? idx}
                    style={{ cursor: 'pointer', background: selectedTransferId === (t.transferId ?? 0) ? '#5a6977ff' : undefined }}
                    onClick={() => {
                      const tId = t.transferId ?? 0
                      setSelectedTransferId(tId)
                      // prefer id mapping
                      if (t.toDoc) {
                        const match = consultants.find((c) => c.consultantId === Number(t.toDoc))
                        setSelectedId(match ? match.consultantId : 0)
                      } else if (t.toDoctor) {
                        const match = consultants.find((c) => c.consultantName === t.toDoctor)
                        setSelectedId(match ? match.consultantId : 0)
                      } else {
                        setSelectedId(0)
                      }
                    }}
                  >
                    <td>{idx + 1}</td>
                    <td>{getFromLabel(t)}</td>
                    <td>{t.toDoctor ?? 'Unknown'}</td>
                    <td>{getStatusLabel(t)}</td>
                    <td>{getTransferDate(t) ? formatDateOnly(getTransferDate(t)) : '-'}</td>
                    <td>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleRemoveFor(t.transferId ?? t.id) }}
                        disabled={getIsCompleted(t) !== 0 || saving}
                      >
                        {saving ? (
                          <><Spinner animation="border" size="sm" className="me-1" />Removing...</>
                        ) : 'Remove'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 d-flex justify-content-center">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                // prepare for a new transfer
                setSelectedTransferId(0)
                setSelectedId(0)
              }}
            >
              Add New
            </Button>
          </div>
        </div>
      )}

      <Form.Group className="mb-3">
        <Form.Label>Select Doctor</Form.Label>
        {loading ? (
          <div className="d-flex align-items-center">
            <Spinner animation="border" size="sm" className="me-2" />
            <span>Loading doctors...</span>
          </div>
        ) : (
          <div className="d-flex align-items-center">
            {/* transparent doctor icon */}
            <span style={{ width: 28, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', opacity: 0.25 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5zM4 20c0-3.866 3.134-7 7-7h2c3.866 0 7 3.134 7 7v1H4v-1z" fill="#000" />
              </svg>
            </span>
            <Form.Select value={selectedId} onChange={(e) => setSelectedId(Number(e.target.value))}>
              <option value={0}>-- Select --</option>
              {consultants.map((c) => (
                <option key={c.consultantId} value={c.consultantId}>
                  {c.consultantName}
                </option>
              ))}
            </Form.Select>
          </div>
        )}
      </Form.Group>
      <div className="text-end">
        <Button variant="secondary" size="sm" className="me-2" onClick={onClose} disabled={saving || loading}>Cancel</Button>
        <Button variant="primary" size="sm" onClick={handleSave} disabled={loading || saving}>
          {saving ? (
            <><Spinner animation="border" size="sm" className="me-1" />Saving...</>
          ) : 'Save'}
        </Button>
      </div>
    </div>
  )
}

export default DoctorTransfer
