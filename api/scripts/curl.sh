
## Multiple
curl -X GET http://localhost:3000/todos --verbose
curl -X PATCH -H "Content-Type: application/json" -d @batch.json http://localhost:3000/todos/ --verbose
curl -X DELETE http://localhost:3000/todos --verbose

## Single
curl -X GET http://localhost:3000/todo/65ac3b70d3adb5df333004d7 --verbose
curl -X POST -H "Content-Type: application/json" -d '{"todo": {"title":"CURL New Todo", "description":"This is a new todo"}}' http://localhost:3000/todo --verbose
curl -X PUT -H "Content-Type: application/json" -d '{"todo": {"title":"CURL XXX Updated Todo", "description":"This is an updated todo"}}' http://localhost:3000/todo/65ac3d1b4c60586e545b3628 --verbose
curl -X DELETE http://localhost:3000/todo/65ac396a9afd90f786ab1fee --verbose

