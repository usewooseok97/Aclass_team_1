// 먹거리 예시

export const getFoodList = () => {
    const base = import.meta.env.BASE_URL;

    return [
        {
            name: "명가들깨칼국수 본점",
            desc: "서울특별시 ",
            desc2: " 언주로 12",
            hours: "09:00~22:00",
            rating: 4.2,
            image: `${base}assets/kalguksu_1.png`
        },
        {
            name: "맘스터치",
            desc: "서울시 ",
            desc2: " 필동로 24",
            hours: "10:00~21:00",
            rating: 4.1,
            image: `${base}assets/momsTouch.jpeg`
        },
        {
            name: "스타벅스",
            desc: "서울시 ",
            desc2: " 세종대로 175",
            hours: "08:00~23:00",
            rating: 4.6,
            image: `${base}assets/starbucks.jpeg`
        },
        {
            name: "을지로 순대국",
            desc: "서울 ",
            desc2: " 을지로 12길 34",
            hours: "07:00~20:00",
            rating: 4.4,
            image: `${base}assets/sundaeguk.jpeg`
        },
        {
            name: "청기와 타운",
            desc: "서울 ",
            desc2: " 자하문로 125",
            hours: "11:00~21:00",
            rating: 4.5,
            image: `${base}assets/cheonggiwa.jpeg`
        },
        {
            name: "한남동 함박",
            desc: "서울 ",
            desc2: " 대사관로 15",
            hours: "11:30~21:30",
            rating: 4.7,
            image: `${base}assets/hambak.jpeg`
        },
        {
            name: "남산돈까스",
            desc: "서울 ",
            desc2: " 소파로 299",
            hours: "10:00~20:00",
            rating: 4.3,
            image: `${base}assets/donkatsu.jpeg`
        },
        {
            name: "토속촌 삼계탕",
            desc: "서울 ",
            desc2: " 자하문로5길 5",
            hours: "10:00~22:00",
            rating: 4.6,
            image: `${base}assets/samgyetang.jpeg`
        },
        {
            name: "버거앤프라이즈",
            desc: "서울 ",
            desc2: " 명동길 14",
            hours: "11:00~22:00",
            rating: 4.0,
            image: `${base}assets/burgerfries.jpeg`
        },
        {
            name: "샤로수길 떡볶이",
            desc: "서울 ",
            desc2: " 이태원로 45길 16",
            hours: "12:00~21:00",
            rating: 4.2,
            image: `${base}assets/tteokbokki.jpeg`
        }
    ];
};