export enum CustomerDueDiligencePepStatus {
   /**
    *   NOT_PEP: Not a PEP
        FORMER_PEP_2_YEARS: Former or inactive PEP (within 2 years)
        FORMER_PEP_OLDER: Former or inactive PEP (older than 2 years)
        DOMESTIC_PEP: Domestic PEP
        FOREIGN_PEP: Foreign PEP
        CLOSE_ASSOCIATES: Close associates
        FAMILY_MEMBERS: Family members
    */

    NotPep = 'NOT_PEP',
    FormerPep2Years = 'FORMER_PEP_2_YEARS',
    FormerPepOlder = 'FORMER_PEP_OLDER',
    DomesticPep = 'DOMESTIC_PEP',
    ForeignPep = 'FOREIGN_PEP',
    CloseAssociates = 'CLOSE_ASSOCIATES',
    FamilyMembers = 'FAMILY_MEMBERS'
}
