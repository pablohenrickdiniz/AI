var Overlap = {
    circleLine: function (circle, line) {
        var med = Math.med(line.pa, line.pb);
        var degree = Math.getDegreeFromVec(line.pa, line.pb);
        var va = Math.rotate(line.pa, -degree, med);
        var vb = Math.rotate(line.pb, -degree, med);
        var cc = Math.rotate({x: circle.x, y: circle.y}, -degree, med);
        var cpMiny = Math.min(line.pa.y, line.pb.y);
        var cpMaxy = Math.max(line.pa.y, line.pb.y);
        var cpMinx = Math.min(line.pa.x, line.pb.x);
        var cpMaxx = Math.max(line.pa.x, line.pb.x);
        var minX = cpMinx - circle.radius;
        var minY = cpMiny - circle.radius;
        var maxX = cpMaxx + circle.radius;
        var maxY = cpMaxy + circle.radius;
        return (((cc.x <= va.x && cc.x >= minX) || (cc.x >= va.x && cc.x <= maxX)) && (cc.t <= maxY && cc.y >= minY));
    },
    circleRect: function (circle, rect) {
        var pa = {x:rect.x,y:rect.y};
        var pc = {x:rect.x+rect.width,y:rect.y+rect.height};

        if(circle.x >= pa.x && circle.x <= pc.x && circle.y >= pa.y && circle.y <= pc.y){
            return true;
        }

        var pb = {x:rect.x+rect.width,y:rect.y};
        var pd = {x:rect.x,y:rect.y+rect.height};
        var la = {pa:pa,pb:pb};
        var lb = {pa:pb,pb:pc};
        var lc = {pa:pc,pb:pd};
        var ld = {pa:pd,pb:pa};

        return(
            this.circleLine(circle,la) ||
            this.circleLine(circle,lb) ||
            this.circleLine(circle,lc) ||
            this.circleLine(circle,ld)
        );
    },
    rectIntersectRect: function (rectA, rectB) {
        var x0a = rectA.x;
        var y0a = rectA.y;
        var x1a = rectA.x + rectA.width;
        var y1a = rectA.y + rectA.height;
        var x0b = rectB.x;
        var y0b = rectB.y;
        var x1b = rectB.x + rectB.width;
        var y1b = rectB.y + rectB.height;
        return !(x0a > x1b || x1a < x0b || y0a > y1b || y1a < y0b);
    }
};
