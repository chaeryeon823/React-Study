import React from "react";

const students = [
    {
        id: 1,
        name: "Inje",
    },
    {
        id: 2,
        name: "Steve",
    },
    {
        id: 3,
        name: "Bill",
    },
    {
        id: 4,
        name: "coco2",
    },
];

const listStudents = students.map((student) =>
    <li>{student.name}</li>    
)
function AttendanceBook(props) {
    return(
        <ul>
            {
            // students.map((student) => {
            //     return <li>{student.name}</li>;
            // })


            // id를 키값으로 사용
            // students.map((student) => {
            //     return  <li key={student.id}>{student.name}</li>;
            // })

            // 포맷팅 된 문자열을 키값으로 사용
            // students.map((student, index) => {
            //     return <li key={`student-id-${students.id}`}>{student.name}</li>
            // })

            // 배열의 인덱스를 키값으로 사용
            students.map((student, index) => {
                return <li key={index}>{student.name}</li>
            })

            //listStudents
            }
        </ul>
    );
}

export default AttendanceBook;