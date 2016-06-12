var BART = {
    map_width: 50,
    map_height: 50,
    longestRoute: 89,
    routes: [
        {
            id: 1,
            name: "Pittsburg/Bay Point <-> Millbrae",
            to: "Pittsburg/Bay Point",
            from: "Millbrae",
            routeLengths: [6, 3, 5, 2, 5, 5, 5, 2, 4, 2, 5, 8, 1, 2, 1, 2, 2, 3, 2, 4, 4, 3, 4, 5, 4],
            routeLength: 89,
            color: 0x00FF00,
            subwayColor: 0xFFF000,
            stops: [
                [852, 962, 0],
                [796, 928, 0],
                [729, 887, 0],
                [669, 851, 0],
                [602, 810, 0],
                [540, 773, 0],
                [478, 735, 0],
                [416, 697, 0],
                [376, 650, 0],
                [375, 618, 0],
                [373, 587, 0],
                [281, 544, 0],
                [148, 510, 0],
                [136, 493, 0],
                [124, 476, 0],
                [112, 458, 0],
                [99, 437, 0],
                [83, 416, 0],
                [70, 396, 0],
                [56, 375, 0],
                [40, 343, 0],
                [52, 314, 0],
                [72, 273, 0],
                [93, 226, 0],
                [149, 181, 0],
                [137, 129, 0]
            ],
            noise: [
                [852, 962, 0.1],
                [796, 928, 0.2],
                [729, 887, 0.3],
                [669, 851, 0.4],
                [602, 810, 0.5],
                [540, 773, 0.6],
                [478, 735, 0.1],
                [416, 697, 0.1],
                [376, 650, 0.1],
                [375, 618, 0.1],
                [373, 587, 0.1],
                [281, 544, 0.1],
                [148, 510, 0.1],
                [136, 493, 0.1],
                [124, 476, 0.1],
                [112, 458, 0.1],
                [99, 437, 0.1],
                [83, 416, 0.9],
                [70, 396, 0.1],
                [56, 375, 0.7],
                [40, 343, 0.8],
                [52, 314, 0.3],
                [72, 273, 0.5],
                [93, 226, 0.4],
                [149, 181, 0.2],
                [137, 129, 0.3]
            ]
        },
        {
            id: 2,
            name: "Richmond <-> Millbrae",
            to: "Richmond",
            from: "Millbrae",
            routeLengths: [4, 3, 4, 2, 2, 3, 4, 2, 5, 8, 1, 2, 1, 2, 2, 3, 2, 4, 4, 3, 4, 6],
            routeLength: 71,
            color: 0x0000FF,
            subwayColor: 0x000FFF,
            stops: [
                [232, 838, 0],
                [250, 815, 0],
                [272, 784, 0],
                [296, 750, 0],
                [315, 722, 0],
                [332, 698, 0],
                [348, 650, 0],
                [346, 618, 0],
                [345, 587, 0],
                [280, 558, 0],
                [137, 520, 0],
                [124, 502, 0],
                [113, 484, 0],
                [100, 466, 0],
                [86, 445, 0],
                [72, 423, 0],
                [58, 403, 0],
                [45, 383, 0],
                [27, 343, 0],
                [40, 306, 0],
                [59, 266, 0],
                [81, 219, 0],
                [124, 124, 0]
            ],
            noise: [
                [232, 838, 0.9],
                [250, 815, 0.5],
                [272, 784, 0.5],
                [296, 750, 0.1],
                [315, 722, 0.2],
                [332, 698, 0.2],
                [348, 650, 0.8],
                [346, 618, 0.9],
                [345, 587, 1.0],
                [280, 558, 1.0],
                [137, 520, 0.9],
                [124, 502, 0.3],
                [113, 484, 0.1],
                [100, 466, 0.1],
                [86, 445, 0.1],
                [72, 423, 0.1],
                [58, 403, 0.1],
                [45, 383, 0.3],
                [27, 343, 0.3],
                [40, 306, 0.3],
                [59, 266, 0.3],
                [81, 219, 0.4],
                [124, 124, 0.1]
            ]
        },
        {
            id: 3,
            name: "Richmond <-> Freemont",
            to: "Richmond",
            from: "Freemont",
            routeLengths: [4, 3, 4, 2, 2, 3, 4, 2, 3, 4, 4, 4, 4, 4, 4, 5, 5],
            routeLength: 61,
            color: 0xFFFF00,
            subwayColor: 0xFFF00F,
            stops: [
                [245, 846, 0],
                [260, 823, 0],
                [283, 792, 0],
                [307, 759, 0],
                [327, 729, 0],
                [342, 705, 0],
                [363, 649, 0],
                [360, 618, 0],
                [358, 586, 0],
                [391, 485, 0],
                [426, 450, 0],
                [462, 411, 0],
                [499, 373, 0],
                [535, 335, 0],
                [612, 255, 0],
                [672, 193, 0],
                [741, 120, 0],
                [795, 66, 0]
            ],
            noise: [
                [245, 846, 0.1],
                [260, 823, 0.3],
                [283, 792, 0.3],
                [307, 759, 0.5],
                [327, 729, 0.7],
                [342, 705, 0.9],
                [363, 649, 0.8],
                [360, 618, 0.1],
                [358, 586, 0.3],
                [391, 485, 0.5],
                [426, 450, 0.9],
                [462, 411, 0.1],
                [499, 373, 0.3],
                [535, 335, 0.3],
                [612, 255, 0.2],
                [672, 193, 0.1],
                [741, 120, 0.1],
                [795, 66, 0]
            ]
        },
        {
            id: 4,
            name: "Freemont <-> Daly City",
            to: "Freemont",
            from: "Daly City",
            routeLengths: [5, 5, 4, 4, 4, 4, 4, 4, 3, 8, 1, 2, 1, 2, 2, 3, 2, 4],
            routeLength: 62,
            color: 0x00FFFF,
            subwayColor: 0xF00FFF,
            stops: [
                [784, 56, 0],
                [730, 110, 0],
                [662, 182, 0],
                [602, 245, 0],
                [524, 326, 0],
                [488, 364, 0],
                [452, 398, 0],
                [414, 439, 0],
                [380, 475, 0],
                [285, 515, 0],
                [171, 492, 0],
                [159, 476, 0],
                [148, 460, 0],
                [135, 441, 0],
                [122, 421, 0],
                [107, 398, 0],
                [94, 380, 0],
                [80, 359, 0],
                [68, 342, 0]
            ],
            noise: [
                [784, 56, 0.1],
                [730, 110, 0.3],
                [662, 182, 0.5],
                [602, 245, 0.7],
                [524, 326, 0.8],
                [488, 364, 0.1],
                [452, 398, 0.3],
                [414, 439, 0.2],
                [380, 475, 0.3],
                [285, 515, 0.5],
                [171, 492, 0.5],
                [159, 476, 0.9],
                [148, 460, 0.9],
                [135, 441, 0.8],
                [122, 421, 0.3],
                [107, 398, 0.1],
                [94, 380, 0.1],
                [80, 359, 0.2],
                [68, 342, 0.2]
            ]
        },
        {
            id: 5,
            name: "Dublin/Pleasanton <-> Daly City",
            to: "Dublin/Pleasanton",
            from: "Daly City",
            routeLengths: [2, 11, 4, 4, 4, 4, 4, 6, 8, 1, 2, 1, 2, 2, 3, 2, 4],
            routeLength: 64,
            color: 0xFF00FF,
            subwayColor: 0xFFFFFF,
            stops: [
                [910, 343, 0],
                [849, 338, 0],
                [654, 320, 0],
                [547, 345, 0],
                [509, 384, 0],
                [473, 421, 0],
                [436, 458, 0],
                [402, 496, 0],
                [281, 529, 0],
                [160, 501, 0],
                [147, 485, 0],
                [136, 467, 0],
                [123, 450, 0],
                [109, 429, 0],
                [94, 407, 0],
                [81, 386, 0],
                [69, 366, 0],
                [55, 341, 0]
            ],
            noise: [
                [910, 343, 0.3],
                [849, 338, 0.3],
                [654, 320, 0.1],
                [547, 345, 0.1],
                [509, 384, 0.5],
                [473, 421, 0.9],
                [436, 458, 0.9],
                [402, 496, 0.7],
                [281, 529, 0.3],
                [160, 501, 0.1],
                [147, 485, 0.1],
                [136, 467, 0.3],
                [123, 450, 0.1],
                [109, 429, 0.2],
                [94, 407, 0.4],
                [81, 386, 0.8],
                [69, 366, 1.0],
                [55, 341, 1]
            ]
        }
    ]
};