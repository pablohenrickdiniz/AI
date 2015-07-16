<!--[if IE]><?=$this->Html->script('box2d/lib/excanvas')?><![endif]-->
<?= $this->Html->script('box2d/lib/prototype-1.6.0.2') ?>
<!-- box2djs -->
<?= $this->Html->script('box2d/lib/prototype-1.6.0.2') ?>
<?= $this->Html->script('box2d/common/b2Settings') ?>
<?= $this->Html->script('box2d/common/math/b2Vec2') ?>
<?= $this->Html->script('box2d/common/math/b2Mat22') ?>
<?= $this->Html->script('box2d/common/math/b2Math') ?>
<?= $this->Html->script('box2d/collision/b2AABB') ?>
<?= $this->Html->script('box2d/collision/b2Bound') ?>
<?= $this->Html->script('box2d/collision/b2BoundValues') ?>
<?= $this->Html->script('box2d/collision/b2Pair') ?>
<?= $this->Html->script('box2d/collision/b2PairCallback') ?>
<?= $this->Html->script('box2d/collision/b2BufferedPair') ?>
<?= $this->Html->script('box2d/collision/b2PairManager') ?>
<?= $this->Html->script('box2d/collision/b2BroadPhase') ?>
<?= $this->Html->script('box2d/collision/b2Collision') ?>
<?= $this->Html->script('box2d/collision/Features') ?>
<?= $this->Html->script('box2d/collision/b2ContactID') ?>
<?= $this->Html->script('box2d/collision/b2ContactPoint') ?>
<?= $this->Html->script('box2d/collision/b2Distance') ?>
<?= $this->Html->script('box2d/collision/b2Manifold') ?>
<?= $this->Html->script('box2d/collision/b2OBB') ?>
<?= $this->Html->script('box2d/collision/b2Proxy') ?>
<?= $this->Html->script('box2d/collision/ClipVertex') ?>
<?= $this->Html->script('box2d/collision/shapes/b2Shape') ?>
<?= $this->Html->script('box2d/collision/shapes/b2ShapeDef') ?>
<?= $this->Html->script('box2d/collision/shapes/b2BoxDef') ?>
<?= $this->Html->script('box2d/collision/shapes/b2CircleDef') ?>
<?= $this->Html->script('box2d/collision/shapes/b2CircleShape') ?>
<?= $this->Html->script('box2d/collision/shapes/b2MassData') ?>
<?= $this->Html->script('box2d/collision/shapes/b2PolyDef') ?>
<?= $this->Html->script('box2d/collision/shapes/b2PolyShape') ?>
<?= $this->Html->script('box2d/dynamics/b2Body') ?>
<?= $this->Html->script('box2d/dynamics/b2BodyDef') ?>
<?= $this->Html->script('box2d/dynamics/b2CollisionFilter') ?>
<?= $this->Html->script('box2d/dynamics/b2Island') ?>
<?= $this->Html->script('box2d/dynamics/b2TimeStep') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2ContactNode') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2Contact') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2ContactConstraint') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2ContactConstraintPoint') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2ContactRegister') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2ContactSolver') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2CircleContact') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2Conservative') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2NullContact') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2PolyAndCircleContact') ?>
<?= $this->Html->script('box2d/dynamics/contacts/b2PolyContact') ?>
<?= $this->Html->script('box2d/dynamics/b2ContactManager') ?>
<?= $this->Html->script('box2d/dynamics/b2World') ?>
<?= $this->Html->script('box2d/dynamics/b2WorldListener') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2JointNode') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2Joint') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2JointDef') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2DistanceJoint') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2DistanceJointDef') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2Jacobian') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2GearJoint') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2GearJointDef') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2MouseJoint') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2MouseJointDef') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2PrismaticJoint') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2PrismaticJointDef') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2PulleyJoint') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2PulleyJointDef') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2RevoluteJoint') ?>
<?= $this->Html->script('box2d/dynamics/joints/b2RevoluteJointDef') ?>
<?= $this->Html->script('draw_world') ?>
<?= $this->Html->script('box2d/common') ?>
<?= $this->Html->css('tool') ?>
<?= $this->Html->css('jquery.minicolors') ?>
<div class="container" id="container">
    <div class="row">
        <div class="col-md-3">
            <div class="tool-box" data-toggle="buttons">
                <div class="btn-group">
                    <label class="btn btn-default active">
                        <input type="radio" name="tool" id="option1" autocomplete="off" value="pointer">
                        <i class="fa fa-hand-o-up"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option2" autocomplete="off" value="move">
                        <i class="fa fa-arrows"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option3" autocomplete="off" value="pencil">
                        <i class="fa fa-pencil"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option4" autocomplete="off" value="rect">
                        <i class="fa fa-square"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option5" autocomplete="off" value="circle">
                        <i class="fa fa-circle"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option6" autocomplete="off" value="image">
                        <i class="fa fa-picture-o"></i>
                    </label>
                    <label class="btn btn-default">
                        <input type="radio" name="tool" id="option7" autocomplete="off" value="select">
                        <i class="fa fa-select"></i>
                    </label>
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-sm-7">
            <canvas id="draw" width="660" height="500" class="thumbnail"></canvas>
        </div>
        <div class="col-sm-2">
            <label for="">Preenchimento</label>
            <input type="text" id="fillColor" class="form-control fillColor" title="preenchimento"/>
        </div>
    </div>
    <div class="row">

    </div>
</div>
<?= $this->Html->script('jquery.minicolors.min') ?>
<?= $this->Html->script('Math') ?>
<?= $this->Html->script('keys') ?>
<?= $this->Html->script('Overlap') ?>
<?= $this->Html->script('physics') ?>
