<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <title>Ação Proibida</title>
    <?=$this->Html->script('bootstrap.css')?>
    <?=$this->Html->script('bootstrap.min')?>
    <script type="text/javascript">
        var segundos = 5;
        var tempo = setInterval(function(){
            if(segundos == 0){
                clearInterval(tempo);
                window.location = '<?=$this->Html->url(array('controller'=>'pages','action'=>'index'))?>';
            }
            else{
                segundos--;
                $('#number').html(segundos);
            }
        },1000);
    </script>
</head>
<body>
   <div class="panel panel-danger" style="margin:150px auto auto auto;width:500px;height:300px;">
       <div class="panel-heading">
           <h4 class="panel-title">
                Ação proibida
           </h4>
       </div>
       <div class="panel-body">
            Você não possui os privilégios necessários para executar essa ação<br>
            <h2 class="text-center" style="font-size:30px;width:100%">
                Redirecionando em...
            </h2>
            <h1 class="text-center" id="number" style="font-size:40px;">5</h1>
       </div>
   </div>
</body>
</html>