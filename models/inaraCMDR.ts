export interface InaraCMDR {
  userID: number;
  userName: string;
  commanderName?: string;
  commanderRanksPilot: {
    rankName: string;
    rankValue: string;
    rankProgress: number;
  }[];
  preferredAllegianceName: string;
  commanderMainShip?: {
    shipType: string;
    shipName: string;
    shipIdent: string;
    shipRole: string;
  };
  commanderSquadron?: {
    squadronID: number;
    squadronName: string;
    squadronMembersCount: string;
    squadronMemberRank: string;
    inaraURL: string;
  };
  commanderWing?: {
    squadronID: number;
    squadronName: string;
    squadronMembersCount: string;
    squadronMemberRank: string;
    inaraURL: string;
  };
  preferredPowerName?: string;
  preferredGameRole: string;
  avatarImageURL?: string;
  inaraURL: string;
  otherNamesFound?: string[];
}
