import { IHumanName, IPatient, NameUse } from 'smartmarkers-lib'


// Todo-RS: Move this convininece method to `smartmarkers-lib`
// Other apps could possible use this
// 
export const calculateAge = (birthday: Date) => {
  var ageDifMs = Date.now() - birthday.getTime()
  var ageDate = new Date(ageDifMs)
  const yrs = Math.abs(ageDate.getUTCFullYear() - 1970)
  const mths = Math.abs(ageDate.getUTCMonth())

  return `${yrs} years`
  // if (!mths) return `${yrs} yrs`
  // return `${yrs} yrs, ${mths} months`
}

export const getHumanNameString = (humanName: IHumanName) => {
  return (humanName.given?.concat(' ') + ' ' + (humanName.family ? humanName.family : '')).trim()
}

// Todo-RS: Move this convininece method to `smartmarkers-lib`
// Other apps could possible use this
// 
export const getPatientName = (patient: IPatient) => {
  if (patient && patient.name && patient.name.length > 0) {
    if (patient.name.length == 1) {
      return getHumanNameString(patient.name[0])
    } else {
      const nameOfficial = patient.name.find(item => item.use && item.use == NameUse.Official)
      if (nameOfficial) {
        return getHumanNameString(nameOfficial)
      } else {
        const nameUsual = patient.name.find(item => item.use && item.use == NameUse.Usual)
        if (nameUsual) {
          return getHumanNameString(nameUsual)
        } else {
          return getHumanNameString(patient.name[0])
        }
      }
    }
  }
  return ''
}
