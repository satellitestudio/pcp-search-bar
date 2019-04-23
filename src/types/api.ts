export interface VesselAPIEntry {
  end: string
  gearTypeBah: string
  gearTypeEng: string
  grossTonnage: string
  length: number
  name: string
  registeredFishingRegions: string
  registrationEndDate: string
  registrationStartDate: string
  ssvid: string
  start: string
  vesselId: string
  width: number
}

export interface VesselAPIResult {
  entries: VesselAPIEntry[]
  limit: number
  nextOffset: number
  offset: number
  query: string
  total: number
}
