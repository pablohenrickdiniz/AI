function drawWorld(world, context) {
    for (var j = world.m_jointList; j; j = j.m_next) {
        drawJoint(j, context);
    }
    for (var b = world.m_bodyList; b; b = b.m_next) {
        context.strokeStyle = b.strokeStyle;
        context.fillStyle = b.fillStyle;
        for (var s = b.GetShapeList(); s != null; s = s.GetNext()) {
            drawShape(s, context);
        }
    }
}
function drawJoint(joint, context) {
    var b1 = joint.m_body1;
    var b2 = joint.m_body2;
    var x1 = b1.m_position;
    var x2 = b2.m_position;
    var p1 = joint.GetAnchor1();
    var p2 = joint.GetAnchor2();
    context.strokeStyle = '#00eeee';
    context.beginPath();
    switch (joint.m_type) {
        case b2Joint.e_distanceJoint:
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            break;

        case b2Joint.e_pulleyJoint:
            // TODO
            break;

        default:
            if (b1 == world.m_groundBody) {
                context.moveTo(p1.x, p1.y);
                context.lineTo(x2.x, x2.y);
            }
            else if (b2 == world.m_groundBody) {
                context.moveTo(p1.x, p1.y);
                context.lineTo(x1.x, x1.y);
            }
            else {
                context.moveTo(x1.x, x1.y);
                context.lineTo(p1.x, p1.y);
                context.lineTo(x2.x, x2.y);
                context.lineTo(p2.x, p2.y);
            }
            break;
    }
    context.stroke();
}
function drawShape(shape, context) {

    switch (shape.m_type) {

        case b2Shape.e_circleShape:
        {
            drawCircle(shape);
        }
            break;
        case b2Shape.e_polyShape:
        {
            context.beginPath();
            context.strokeStyle = 'black';
            var poly = shape;
            var tV = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[0]));
            context.moveTo(tV.x, tV.y);
            for (var i = 0; i < poly.m_vertexCount; i++) {
                var v = b2Math.AddVV(poly.m_position, b2Math.b2MulMV(poly.m_R, poly.m_vertices[i]));
                context.lineTo(v.x, v.y);
            }
            context.lineTo(tV.x, tV.y);
            context.fill();
            context.stroke();

        }
            break;
    }

}


function drawCircle(circle){

    var pos = circle.m_position;
    var r = circle.m_radius;
    context.beginPath();
    context.fillStyle  = 'black';
    context.arc(pos.x, pos.y, r, 0, 2 * Math.PI, false);
    context.strokeStyle = 'black';
    context.stroke();
}

