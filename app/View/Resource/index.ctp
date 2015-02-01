<table class="table table-striped">
    <tr>
        <th></th>
        <th>Nome</th>
        <th>Data de disponibilização</th>
        <th>Disponibilizador</th>
        <th></th>
    </tr>
    <?php foreach($resources as $resource):?>
        <tr>
            <td></td>
            <td><?=$resource['Resource']['name']?></td>
            <td><?=$resource['Resource']['date']?></td>
            <td><?=$resource['User']['fullname']?></td>
        </tr>
    <?php endforeach;?>
</table>