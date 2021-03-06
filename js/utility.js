var SBus = {};

(function() {

    SBus.printTime = function(h,m) {
        var result = "";
        if(h < 10) {
            result += "0";
        }
        result += h.toString();
        result += ":";
        if(m<10) {
            result += "0";
        }
        result += m.toString();
        result += " ";
        return result;
    };

    SBus.initContent = function(stopName, special) {
        return "<div class='tip-content'>" +
           "<h4 class='title'>" + stopName + "</h4>" +
           "<p class='attention'>1. 蓝色班次：终点站东川路地铁站</p>" +
           "<p class='attention'>2. 周六日及法定节假日停运</p>" +
           (special ? "<p class='attention'>3.红色标注班次终点站［可能］为菁菁堂（根据本站作者的猜测＝。＝）</p>" : '');
    };

    SBus.initContentMobile = function(stopName) {
        return "<h4 class='title'>" + stopName + "</h4>" +
           "<p class='attention'>1.蓝色班次：终点站东川路地铁站</p>" +
           "<p class='attention'>2.周六日及法定节假日停运</p>" +
           "<p class='attention'>3.请<span class='red'>滚动查看</span>以下时间</p>" + 
           "<div class='tip-scroll'>" + "<div class='tip-content'>";
    };

    SBus.calcTime = function(timeArr, diff) {
        for (var i = 0; i < timeArr.length; i+=2) {
            var hour = timeArr[i],
                minute = timeArr[i+1];
            minute += diff;
            if (minute >= 60) {
                minute -= 60;
                hour++;
            } else if (minute < 0) {
                minute += 60;
                hour--;
            }
            timeArr[i] = hour;
            timeArr[i+1] = minute;
        }
    };

    SBus.nextStop = function(timeList, diff) {
        SBus.calcTime(timeList['direct1'], diff.direct1_diff);
        SBus.calcTime(timeList['festival_direct1'], diff.direct1_diff);
        SBus.calcTime(timeList['direct2'], diff.direct2_diff);
        SBus.calcTime(timeList['festival_direct2'], diff.direct2_diff);
    };

    SBus.pushDirectToContent = function(directId, stopTime, stopName) {
        var date = new Date();
        var day = date.getDay();
        var hour = date.getHours();
        var minute = date.getMinutes();
        var directName,
            sContent = '';
        switch (directId) {
            case 'direct1':
                directName = '逆时针';
                break;
            case 'direct2':
                directName = '顺时针';
                break;
            case 'festival_direct1':
                directName = '寒暑假－逆时针';
                break;
            case 'festival_direct2':
                directName = '寒暑假－顺时针';
                break;
            default:
                directName = '';
                break;
        }
        if (!directName) {
            return sContent;
        }
        sContent += "<h5 class='direct'>" + directName + "</h5>" + "<p class='timetable'>";
        var j = 0;
        var timeArr = stopTime[directId];
        var blueNum = stopTime[directId + '_blue'];
        var redNum = stopTime[directId + '_red'];
        // if it's Sunday or Saturday
        /*if (day == 0 || day == 6) {
            for(; j<timeArr.length; j += 2) {
                sContent += printTime(timeArr[j], timeArr[j + 1]);
            }
            sContent += "</span>" + "</p>";
            return sContent;
        }*/

        //If current time < 20:30, show all times with regular color.
        var showTime = new Date();
        showTime.setHours(20);
        showTime.setMinutes(30);
        if (showTime > Date.now()) {
            sContent += "<span class='silver'>";
            for(; j<timeArr.length; j += 2) {
                if(timeArr[j] < hour || (timeArr[j] == hour && timeArr[j + 1] <= minute)) {
                    sContent += SBus.printTime(timeArr[j], timeArr[j + 1]);
                } else {
                    break;
                }
            }
            sContent += "</span>";
        }

        if(redNum) {
            for(; j<timeArr.length - redNum * 2; j += 2) {
                sContent += SBus.printTime(timeArr[j], timeArr[j + 1]);
            }
            sContent += "<span class='red'>";
            for(; j<timeArr.length; j += 2) {
                sContent += SBus.printTime(timeArr[j], timeArr[j + 1]);
            }
            sContent += "</span></p>";
        } else if(blueNum) {
            for(; j<timeArr.length - blueNum * 2; j += 2) {
                sContent += SBus.printTime(timeArr[j], timeArr[j + 1]);
            }
            sContent += "<span class='blue'>";
            for(; j<timeArr.length; j += 2) {
                sContent += SBus.printTime(timeArr[j], timeArr[j + 1]);
            }
            sContent += "</span></p>";
        } else {
            for(; j<timeArr.length; j += 2) {
                sContent += SBus.printTime(timeArr[j], timeArr[j + 1]);
            }
            sContent += "</p>";
        }
        return sContent;
    };
}());