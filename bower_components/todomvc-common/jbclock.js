function JBCountDown(settings) {

    var glob = settings;

   //console.log(settings);

    function deg(deg) {
        return -(Math.PI/180)*deg - (Math.PI/180)*90
    }
    glob.secondsColor = "#ffdc50";
    glob.secondsGlow = "none";

    glob.minutesColor = "#9cdb7d";
    glob.minutesGlow = "none";

    glob.hoursColor = "#378cff";
    glob.hoursGlow = "none";

    glob.daysColor = "#ff6565";
    glob.daysGlow = "none";

    glob.monthsColor = "#B096FF";
    glob.monthsGlow = "none";

    glob.yearsColor = "#FFA3F2";
    glob.yearsGlow = "none";


    glob.total   = Math.floor((glob.endDate - glob.startDate)/86400);
	glob.years   = 5 - Math.floor((glob.endDate - glob.nowDate ) / 86400 / 365);
	glob.months  = 12 - Math.floor((((glob.endDate - glob.nowDate) / 86400) % 365) / 31);
    glob.days    = 31 - Math.floor((((glob.endDate - glob.nowDate) / 86400) % 365) % 31);
    glob.hours   = 24 - Math.floor(((glob.endDate - glob.nowDate) % 86400) / 3600);
    glob.minutes = 60 - Math.floor((((glob.endDate - glob.nowDate) % 86400) % 3600) / 60) ;
    glob.seconds = 60 - Math.floor((glob.endDate - glob.nowDate) % 86400 % 3600 % 60);

    if (glob.nowDate >= glob.endDate) {
        return;
    }
    
    var clock = {
        set: {
			years: function(){
                var cyears = $("#canvas_years").get(0);
                var ctx = cyears.getContext("2d");
                ctx.clearRect(0, 0, cyears.width, cyears.height);
                ctx.beginPath();
                ctx.strokeStyle = glob.yearsColor;
                
                ctx.shadowBlur    = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = glob.yearsGlow;
                
                ctx.arc(75,75,68, deg(0), deg(72*glob.years));
                ctx.lineWidth = 13;
                ctx.stroke();
                $(".clock_years .val").text(5-glob.years);
            },
			
			months: function(){
                var cmonths = $("#canvas_months").get(0);
                var ctx = cmonths.getContext("2d");
                ctx.clearRect(0, 0, cmonths.width, cmonths.height);
                ctx.beginPath();
                ctx.strokeStyle = glob.monthsColor;
                
                ctx.shadowBlur    = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = glob.monthsGlow;
                
                ctx.arc(75,75,68, deg(0), deg(30*glob.months));
                ctx.lineWidth = 13;
                ctx.stroke();
                $(".clock_months .val").text(12-glob.months);
            },
			
            days: function(){
                var cdays = $("#canvas_days").get(0);
                var ctx = cdays.getContext("2d");
                ctx.clearRect(0, 0, cdays.width, cdays.height);
                ctx.beginPath();
                ctx.strokeStyle = glob.daysColor;
                
                ctx.shadowBlur    = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = glob.daysGlow;
                
                ctx.arc(75,75,68, deg(0), deg(11.6*glob.days));
                ctx.lineWidth = 13;
                ctx.stroke();
                $(".clock_days .val").text(31-glob.days);
            },
            
            hours: function(){
                var cHr = $("#canvas_hours").get(0);
                var ctx = cHr.getContext("2d");
                ctx.clearRect(0, 0, cHr.width, cHr.height);
                ctx.beginPath();
                ctx.strokeStyle = glob.hoursColor;
                
                ctx.shadowBlur    = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = glob.hoursGlow;
                
                ctx.arc(75,75,68, deg(0), deg(15*glob.hours));
                ctx.lineWidth = 13;
                ctx.stroke();
                $(".clock_hours .val").text(24 - glob.hours);
            },
            
            minutes : function(){
                var cMin = $("#canvas_minutes").get(0);
                var ctx = cMin.getContext("2d");
                ctx.clearRect(0, 0, cMin.width, cMin.height);
                ctx.beginPath();
                ctx.strokeStyle = glob.minutesColor;
                
                ctx.shadowBlur    = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = glob.minutesGlow;
                
                ctx.arc(75,75,68, deg(0), deg(6*glob.minutes));
                ctx.lineWidth = 13;
                ctx.stroke();
                $(".clock_minutes .val").text(60 - glob.minutes);
            },
            seconds: function(){
                var cSec = $("#canvas_seconds").get(0);
                var ctx = cSec.getContext("2d");
                ctx.clearRect(0, 0, cSec.width, cSec.height);
                ctx.beginPath();
                ctx.strokeStyle = glob.secondsColor;
                
                ctx.shadowBlur    = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowColor = glob.secondsGlow;
                
                ctx.arc(75,75,68, deg(0), deg(6*glob.seconds));
                ctx.lineWidth = 13;
                ctx.stroke();
        
                $(".clock_seconds .val").text(60 - glob.seconds);
            }
        },
       
        start: function(){
            /* Seconds */
            var cdown = setInterval(function(){
                if ( glob.seconds > 59 ) {
                    if (5-glob.years == 0 && 12-glob.months == 0 && 31-glob.days == 0 && 24-glob.hours == 0 && 60-glob.minutes == 0 && 60-glob.seconds == 0) {
                        clearInterval(cdown);
                        alert('adasd');
                        /* Countdown is complete */

                        return
                    }
                    glob.seconds = 1;
                    if (glob.minutes > 59) {
                        glob.minutes = 1;
                        clock.set.minutes();
                        if (glob.hours > 23) {
                            glob.hours = 1;
                            if (glob.days > 360) {
                                glob.days--;
                                clock.set.days();
								if (glob.months > 12) {
									glob.months--;
									clock.set.months();
									if(glob.years > 10) {
										glob.years--;
										clock.set.years();
									}
								}
                            }
                        } else {
                            glob.hours++;
                        }
                        clock.set.hours();
                    } else {
                        glob.minutes++;
                    }
                    clock.set.minutes();
                } else {
                    glob.seconds++;
                }
                clock.set.seconds();
                if(glob.years == 0 && glob.months == 0 && glob.days == 0 && glob.hours == 0 && glob.minutes == 0 && glob.seconds == 0) {alert('sdfsdf');}
            },1000);
        }
    }
    clock.set.seconds();
    clock.set.minutes();
    clock.set.hours();
    clock.set.days();
	clock.set.months();
	clock.set.years();
    clock.start();
}