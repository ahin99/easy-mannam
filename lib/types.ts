export type Meeting = {
  id: string;
  code: string;
  title: string;
  expected_count: number;
  start_date: string;
  end_date: string;
  created_at: string;
};

export type Participant = {
  id: string;
  meeting_id: string;
  name: string;
};

export type Availability = {
  participant_id: string;
  available_date: string;
};

export type ResultDateRow = {
  date: string;
  label: string;
  availableCount: number;
  availableNames: string[];
  unavailableNames: string[];
  isAllAvailable: boolean;
};

export type MeetingResults = {
  code: string;
  title: string;
  expectedCount: number;
  votedCount: number;
  notVotedCount: number;
  topDates: ResultDateRow[];
  dateRows: ResultDateRow[];
};
