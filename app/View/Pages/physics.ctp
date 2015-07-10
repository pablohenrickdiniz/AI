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
<?= $this->Html->script('box2d/common')?>
<div class="container" id="container">
    <div class="col-md-9">
        <canvas id="draw" width="700" height="500"></canvas>
    </div>
    <div class="col-md-3">
        <div class="tool-box">
            <div class="tool-box-header">

            </div>
            <div class="tool-box-body">
                <div class="tool">

                </div>
            </div>
        </div>
    </div>

</div>

<style type="text/css">
    #draw{
        border:1px solid gray;
    }

    #container{
        padding-top:10px;
    }

    .tool-box{
        width:100px;
        height:500px;
        border:1px solid black;
        float:left;
        background-color:#d6d6d6;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;;
    }
</style>


<script type="text/javascript">
    $2 = jQuery.noConflict();
    $2(document).ready(function(){
        var time_step = 1.0/60;
        var interval  = null;
        var worldAABB = new b2AABB();
        worldAABB.minVertex.Set(-500, -500);
        worldAABB.maxVertex.Set(500,500);
        var gravity = new b2Vec2(0, 100);
        var doSleep = true;


        world = new b2World(worldAABB, gravity, doSleep);
        context = document.getElementById('draw').getContext('2d');


        function start(){
            step();
        }

        function step() {
            world.Step(time_step,1);
            context.clearRect(0,0,500,500);
            drawWorld(world,context);
            interval = setTimeout(step,10);
        }

        start();


        function stop(){
            clearInterval(interval);
        }

        var started = true;
        document.onclick = function(){
            if(started){
                stop();
            }
            else{
                step();
            }
            started = !started;
        }
    });
</script>

