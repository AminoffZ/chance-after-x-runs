const gradient = [
    [
      0,
      [180, 0, 0]
    ],
    [
      45,
      [180, 180, 0]
    ],
    [
      75,
      [0, 180, 0]
    ],
    [
      100,
      [0, 0, 180]
    ]
];

function getColor(pos) {
    if(pos === 0) {
        return [0,0,0];
    }
    let color = [];
    for (let i=0; i<gradient.length; i++) {
        if (pos > gradient[i][0]) {
        continue;
        } else {
            const firstColor = gradient[i-1][1];
            const secondColor = gradient[i][1];
            const ratio = (pos-gradient[i-1][0])/(gradient[i][0]-gradient[i-1][0]);
            const difference = [
                secondColor[0]-firstColor[0],
                secondColor[1]-firstColor[1],
                secondColor[2]-firstColor[2]
            ];
            color = [
                Math.round(firstColor[0]+difference[0]*ratio),
                Math.round(firstColor[1]+difference[1]*ratio),
                Math.round(firstColor[2]+difference[2]*ratio)
            ];
        return color;
        }
    }
}