export const EVENTS = [
    {
        _id: 1,
        user: {
            username: "johndoe",
            fullName: "John Doe",
            profileImg: "/avatars/boy1.png"
        },
        title: "Event 1",
        description: "Description of event 1",
        location: "Location 1",
        startDate: "24th December 2025",
        endDate: new Date(),
        img: "/posts/post1.png",
        attendees: [
            {
                _id: 1,
                user: {
                    username: "janeSmith",
                    fullName: "Jane Smith",
                    profileImg: "/avatars/girl1.png"
                }
            }
        ]
    },
    {
        _id: 2,
        user: {
            username: "janedoe",
            fullName: "Jane Doe",
            profileImg: "/avatars/girl2.png"
        },
        title: "Event 2",
        description: "Description of event 2",
        location: "Location 2",
        startDate: "31th July 2025",
        endDate: new Date(),
        img: "/posts/post2.png",
        attendees: [
            {
                _id: 1,
                user: {
                    username: "JohnSmith",
                    fullName: "John Smith",
                    profileImg: "/avatars/boy2.png"
                }
            }
        ]
    },
    {
        _id: 3,
        user: {
            username: "Jacobdoe",
            fullName: "JAcob Doe",
            profileImg: "/avatars/boy1.png"
        },
        title: "Event 3",
        description: "Description of event 3",
        location: "Location 3",
        startDate: "14th June 2025",
        endDate: new Date(),
        img: "/posts/post3.png",
        attendees: []
    }
]