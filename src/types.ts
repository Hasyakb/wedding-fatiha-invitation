export type InvitationTemplateStyle =
  | 'royalEnvelope'
  | 'calligraphyPen'
  | 'goldenBokeh'
  | 'baroqueTablescape'
  | 'oliveRusticTablescape'
  | 'emeraldLantern';

export type CalligraphyBgPreset =
  | 'auto'
  | 'nabawi'
  | 'zayed'
  | 'haram'
  | 'aqsa'
  | 'velvet'
  | 'parchment'
  | 'emerald'
  | 'amberGlow'
  | 'custom';

export type AspectRatioType = '9:16' | '16:9' | '1:1';

export interface InvitationData {
  aspectRatio?: AspectRatioType;
  templateStyle?: InvitationTemplateStyle;
  calligraphyBgPreset?: CalligraphyBgPreset;
  calligraphyBgOpacity?: number; // 0.15 to 0.75, default ~0.38
  calligraphyBgBlur?: number; // 0 to 4px, default ~0.5
  calligraphyCustomBgUrl?: string;
  courtesyName?: string;
  bismillah: boolean;
  bismillahText: string;
  familyIntro: string;
  familyLateFather: string;
  familySecondFather: string;
  invitationPhrase: string;
  eventHeading: string;
  childrenPhrase: string;
  groomName: string;
  groomNick: string;
  brideName: string;
  brideNick: string;
  eventDate: string;
  eventTime: string;
  venueLabel: string;
  venueAddress: string;
  receptionNote: string;
  rsvpLabel: string;
  rsvpNumbers: string[];
  themeColor: 'gold' | 'roseGold' | 'emeraldGold';
  mosqueTheme?: 'auto' | 'nabawi' | 'haram' | 'aqsa' | 'zayed';
  mosqueDisplayMode?: 'photo' | 'silhouette' | 'both';
  mosquePhotos?: {
    nabawi: string;
    haram: string;
    aqsa: string;
    zayed: string;
  };
  mosquePhotoOpacity?: number; // 0.1 to 0.7 (default ~0.35)
  mosquePhotoBlur?: number; // 0 to 5px (default ~1.0)
  bridePhotoUrl?: string;
  groomPhotoUrl?: string;
  goldenBokehQuoteTitle?: string;
  goldenBokehQuoteVerse?: string;
  goldenBokehFunctionTitle?: string;
  baroqueMonogram?: string;
  baroqueQuranArabic?: string;
  baroqueQuranTranslation?: string;
  baroqueForeverTitle?: string;
  baroqueForeverQuote?: string;
  baroqueValimaTitle?: string;
  baroqueValimaDate?: string;
  baroqueValimaVenue?: string;
  // 5th Template: Aesthetic Olive Rustic Tablescape
  oliveMonogram?: string;
  oliveBismillahText?: string;
  oliveHoldDateText?: string;
  oliveQuranQuote?: string;
  oliveQuranRef?: string;
  oliveNikahTime?: string;
  oliveReceptionTime?: string;
  oliveReceptionVenue?: string;
  oliveVenueTitle?: string;
  oliveFinaleText?: string;
}

export interface MosquePhotoSet {
  nabawi: string;
  haram: string;
  aqsa: string;
  zayed: string;
}

export interface VideoScene {
  id: number;
  title: string;
  start: number;
  end: number;
}

export interface AnalysisKeyScene {
  timestamp: string;
  scene: string;
}

export interface VideoAnalysisResult {
  eventTitle?: string;
  hosts?: string;
  groom?: string;
  bride?: string;
  venue?: string;
  date?: string;
  time?: string;
  reception?: string;
  rsvp?: string[];
  visualTheme?: string;
  keyScenes?: AnalysisKeyScene[];
  summary?: string;
  note?: string;
}
