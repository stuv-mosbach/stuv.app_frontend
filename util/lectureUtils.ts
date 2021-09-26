export interface lectureType {
  id?: number,
  date: Date,
  startTime: Date,
  endTime: Date,
  name: string,
  type: "PRESENCE" | "ONLINE" | "HYBRID",
  lecturer: string,
  rooms: string[],
  course: string,
  used?: boolean,
}

export const groupLectures = (lectures : lectureType[]) => {
  const grouped : lectureType[][] = [];
  if (lectures.length === 0) return [];
  let date = lectures[0].date;
  let list : lectureType[] = [];
  lectures.forEach(l => {
    if (date.valueOf() === l.date.valueOf()) {
      list.push(l);
    } else {
      grouped.push(list);
      list = [l];
      date = l.date;
    }
  })
  grouped.push(list);
  return grouped;
}

export const getLectureColor = (lecture : lectureType) => {
  if (lecture.name.toLowerCase().includes("klausur") || lecture.name.toLowerCase().includes("prüfung")) {
    return "bg-red-800";
  } else if (lecture.type === "ONLINE" || lecture.type === "HYBRID") {
    return "bg-sky-800";
  } else if (lecture.rooms.length === 0 && (lecture.lecturer === undefined || lecture.lecturer.length === 0)) {
    return "bg-green-900";
  }

  return "bg-gray-900";
}

export const getLectureType = (lecture : lectureType) : keyof filterType => {
  if (lecture.name.toLowerCase().includes("klausur") || lecture.name.toLowerCase().includes("prüfung")) {
    return "test";
  } else if (lecture.type === "ONLINE" || lecture.type === "HYBRID") {
    return "online";
  } else if (lecture.rooms.length === 0 && (lecture.lecturer === undefined || lecture.lecturer.length === 0)) {
    return "free";
  }

  return "normal";
}

export interface filterType {
  normal?: boolean;
  online?: boolean;
  test?: boolean;
  free?: boolean;
}

export const formatCourseName = (name : string) : string => {
  const parts = name.split("-");
  parts.shift();
  return parts.join("-");
}
