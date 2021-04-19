Point belajar 
1. Perhatikan urutan untuk modal, kutip pada parameter function onclick
- Benar
```
<button type="button" class=" btn btn-warning m-2"  data-bs-toggle="modal" data-bs-target="#modal-project" data-bs-toggle="tooltip" title="Edit Project" style="width: 30%" onclick="showFormEditProject(${el.ProjectId}, '${el.Project.name}')"> Edit </button>
```


- Salah (modal gakan ter pop up)
```
<button type="button" class=" btn btn-warning m-2"  data-bs-toggle="tooltip" title="Edit Project" style="width: 30%" data-bs-toggle="modal" data-bs-target="#modal-project" onclick="showFormEditProject(${el.ProjectId}, '${el.Project.name}')" > Edit </button>
```