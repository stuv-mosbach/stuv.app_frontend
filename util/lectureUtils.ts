
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
    l.rooms = l.rooms.map(r => r.replaceAll(/Vorlesungsraum/ig, "").trim())
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
  if (lecture.name && (lecture.name.toLowerCase().includes("klausur") || lecture.name.toLowerCase().includes("prüfung"))) {
    return "bg-red-800";
  } else if (lecture.type === "ONLINE" || lecture.type === "HYBRID") {
    return "bg-sky-800";
  } else if (lecture.name && (lecture.name.toLowerCase().includes("selbststudium") || lecture.name.toLowerCase().includes("study day"))) {
    return "bg-zinc-900";
  } else if (lecture.rooms.length === 0 && (lecture.lecturer === undefined || lecture.lecturer.length === 0)) {
    return "bg-green-900";
  }

  return "bg-zinc-900";
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

const nameMap = {
  "TWIW": "Wirtschaftsingenieurwesen",
  "TMT": "Mechatronik",
  "TFS": "Fassadentechnik",
  "TMB": "Maschinenbau",
  "THT": "Holztechnik",
  "TPM": "Projektmanagement",
  "TINF": "Angewandte Informatik",
  "TET": "Elektrotechnik",
  "TOEB": "Öffentliches Bauen",
  "TÖB": "Öffentliches Bauen",

  "WIN": "BWL - Industrie",
  "WWI": "Wirtschaftsinformatik",
  "WHD": "BWL - Handel",
  "WBK": "BWL - Bank",
  "WBSTUF": "Betriebswirtschaftliche Steuerlehre, Unternehmensrechnung und Finanzen",
  "WGW": "BWL - Gesundheitsmanagement",
  "WGM": "BWL - Gesundheitsmanagement",
  "WON": "Onlinemedien",
  "WIB": "BWL - International Business",
  "WDBM": "BWL - Digital Business Management",
  "WHI": "BWL - Handel - Internationaler Handel",
  //"WIPB": "??"
}

export interface CourseGroup {
  name: string,
  type: "W" | "T"
  keys: string[]
}

export interface CourseTypeGrouped {
  wirtschaft: CourseGroup[],
  technik: CourseGroup[]
}

export const nameGroupCourses = (courses: string[]) : CourseTypeGrouped => {
  let grouped : CourseGroup[] = [];
  const used = new Set<string>();

  for (let courseGroup in nameMap) {
    // @ts-ignore
    grouped.push({name: nameMap[courseGroup], keys: courses.filter(c => {
      const name = c.split("-")[1];
      if (name) {
        const include = name.startsWith(courseGroup);
        if (include) used.add(c);
        return include;
      }
      return false;
    }), type: courseGroup.startsWith("T") ? "T" : "W"})
  }

  grouped.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // Namen müssen gleich sein
    return 0;
  });

  const unused = courses.filter(c => !used.has(c));

  grouped.push({name: "Sonstiege", keys: unused.filter(c => c.startsWith("MOS-T") || c.startsWith("MGH-T")), type: "T"});
  grouped.push({name: "Sonstiege", keys: unused.filter(c => c.startsWith("MOS-W") || c.startsWith("MGH-W") || (!c.startsWith("MOS-T") && !c.startsWith("MGH-T"))), type: "W"});

  grouped = grouped.filter(g => g.keys.length > 0);

  return {
    wirtschaft: grouped.filter(g => g.type === "W"),
    technik: grouped.filter(g => g.type === "T")
  };
}
