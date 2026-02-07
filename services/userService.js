exports.getHomeData = () => {
    return {
        categories: [
            { name: "Men's Collection", img: "/images/men.jpg" },
            { name: "Women's Collection", img: "/images/women.jpg" },
            { name: "Kids' Collection", img: "/images/kids.jpg" }
        ],
        products: [
            { name: "Ultra Run Pro", price: 129.99, img: "/images/p1.jpg" },
            { name: "Classic Office", price: 89.99, img: "/images/p2.jpg" },
            { name: "Street Style Max", price: 59.99, img: "/images/p3.jpg" },
            { name: "Pro Strike Elite", price: 109.99, img: "/images/p4.jpg" }
        ]
    };
};

exports.getVerificationData = () => {
    return {
        phoneEnding: "**89",
        expiry: "04:32"
    };
};

exports.getUser = () => {
    return {
        name: "John Doe",
        email: "john@example.com",
        phone: "+1234567890"
    };
};
