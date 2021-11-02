import axios from "axios";

export interface UpdateInfo {
  startTime:    Date;
  endTime:      Date;
  status:       string;
  id:           number;
  newCount:     number;
  updatedCount: number;
  removedCount: number;
  hasChanges:   boolean;
}

export interface DetailedUpdateInfo {
  startTime:       Date;
  endTime:         Date;
  status:          string;
  newLectures:     Lecture[];
  updatedLectures: UpdatedLecture[];
  removedLectures: Lecture[];
  id:              number;
}

export interface Lecture {
  date:      Date;
  startTime: Date;
  endTime:   Date;
  name:      string;
  type:      "PRESENCE" | "ONLINE" | "HYBRID";
  lecturer:  string;
  rooms:     string[];
  course:    string;
  id:        number;
}

export interface UpdatedLecture {
  lecture:     Lecture;
  changeInfos: ChangeInfo[];
  id:          number;
}

export interface ChangeInfo {
  fieldName:     keyof Lecture;
  fieldType:     "string" | "array" | "date" | "number";
  previousValue: string;
  value:         string;
  id:            number;
}


export const getUpdateInfos = (amount = 20, skip = 0) : Promise<UpdateInfo[]> => {
  return new Promise<UpdateInfo[]>(resolve => {
    axios.get<UpdateInfo[]>(`${process.env.NEXT_PUBLIC_API_BASE}/sync/latest`, {
      params: {
        amount,
        skip
      }
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      resolve([]);
      console.log("Failed to load updates");
      console.log(err);
    })
  })
}

export const getUpdateInfo = (id : number) : Promise<DetailedUpdateInfo | undefined> => {
  return new Promise<DetailedUpdateInfo | undefined>(resolve => {
    axios.get<DetailedUpdateInfo>(`${process.env.NEXT_PUBLIC_API_BASE}/sync/${id}`, {
    }).then(res => {
      resolve(res.data);
    }).catch(err => {
      resolve(undefined);
      console.log("Failed to load updates");
      console.log(err);
    })
  })
}