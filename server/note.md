1. users ->
   di error case jangan cuman expect.any(Array)
   api doc error message ganti:
   {
   status: code
   message: array message
   }

misal expect(res.body.message[0]).toEqual('title is required)

2. jangan lupa beforeAll buat naro data todo baru, sehingga kita bisa deklare todoId untuk case2 route selnajutnya
3. Get all -> ga usah pakai error case jika todo array kosong, karena itu adalah success cuman emg daatanya kosong. jangan data not found (ini untuk get by id)
4. di line 10 -> todo-> bikin todonya
5. Forbidden 403 pada authorization jangan code 401 (message bebas tp code 403 bukan 401)
6. 401 vs 403
   401 dia ga login
   403 dia login tapi ngakses sesuatu orang lain(kena authorization)
7. pada authentication, error handler harus dibedakan berdasarkan name error token (baca dokuemntasi jsonwebtoken)
8. Get all project -> otak atik junction ya,
   jangan lupa ilangin error case 404
   kasi case succes 2: token biasa, token owner

- harusnya pas get all project, keluar name, ada user owner dan user member (kalo bisa di kasi keterangan),
  dan todo2 nya
  9.get project by id ->result:
- detail project, member,owner, todo apa aja

10. routes adddUser -> success message: "successa add user", nanti di client tinggal fetch ulang project by id
11. line 344 -> apus roues dan data nya
12. jadi api project point 7 apus
13. api project point 8, 9, 10 ppindahin ke /todos bikin case baru


// gajadi pakai validasi due_date harus lebih dari today