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

2. Change Time Zone Heroku 
```
https://medium.com/@hibangun/how-to-change-timezone-server-to-local-at-heroku-e3e385bebd3a
https://help.heroku.com/XKRPVR53/how-to-change-the-timezone-setting-for-heroku-postgres
```