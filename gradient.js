const gradient = [
    [0,
      [180, 0, 0]],     // Red
    [45,
      [180, 180, 0]],   // Yellow
    [75,
      [0, 180, 0]],     // Green
    [100,
      [0, 0, 180]]      // Blue
];

// We get a color from the gradient based on input
function getColor(pos) {
    let color = [0, 0, 0];
    if(pos === 0) {
        return color;
    }
    for (let i=0; i<gradient.length; i++) {
        if (pos > gradient[i][0]) {
            continue;
        } else {
            const firstColor = gradient[i-1][1];
            const secondColor = gradient[i][1];
            const ratio = (pos-gradient[i-1][0])/(gradient[i][0]-gradient[i-1][0]);
            for (let j=0; j<color.length; j++) {
                color[j] = Math.round(firstColor[j]+(secondColor[j]-firstColor[j])*ratio);
            }
        break;
        }
    }
    return color;
}