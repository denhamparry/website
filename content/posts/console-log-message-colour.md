---
author: Lewis Denham-Parry
date: 2017-06-26T13:43:20Z
description: ""
draft: false
slug: console-log-message-colour
title: Console log message colour
aliases:
    - "/console-log-message-colour/"
---

Function to add colour to console log messages:

```javascript
function log(msg, color) {
    color = color || "black";
    bgc = "White";
    switch (color) {
        case "success":  color = "Green";      bgc = "LimeGreen";       break;
        case "info":     color = "DodgerBlue"; bgc = "Turquoise";       break;
        case "error":    color = "Red";        bgc = "Black";           break;
        case "start":    color = "OliveDrab";  bgc = "PaleGreen";       break;
        case "warning":  color = "Tomato";     bgc = "Black";           break;
        case "end":      color = "Orchid";     bgc = "MediumVioletRed"; break;
        default: color = color;
    }

    if (typeof msg == "object") {
        console.log(msg);
    } else if (typeof color == "object") {
        console.log("%c" + msg, "color: PowderBlue;font-weight:bold; background-color: RoyalBlue;");
        console.log(color);
    } else {
        console.log("%c" + msg, "color:" + color + ";font-weight:bold; background-color: " + bgc + ";");
    }
}
```

[Credit to NightOwlPrgmr](https://stackoverflow.com/a/25042340/4090981)