const express = require('express');
const { v4: uuidv4 } = require('uuid');
const app = express();
const users = [];
var units = [];
var categories = [];
var inventory = [];
var orders = [];
var damaged = [];
var d = new Date();
var today = d.getDate() + "/"+d.getMonth()+"/"+d.getFullYear();
const port = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors({
  origin: '*'
}));

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://Gaurav_nv:Amirtha28@cluster0.83xxr.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

var bodyParser = require('body-parser');


var urlencodedParser = bodyParser.urlencoded({ extended: true })

let status = { 
  login_status : false,
  is_admin : false,
  user_name: "",
  message: "",
  is_checker:false,
}

client.connect(err => {
  const db = client.db("InventoryManagement");
  const Users = db.collection("Users");
  Users.find({}).toArray((err1,result)=> {
    if(result != undefined){
      for(let i=0; i<result.length; i++){
        users.push(result[i]);
      }
      
    }
  });
  
  const Units = db.collection("Units");
    Units.find({}).toArray((err1,result)=> {
      if(result != undefined){
        for(let i=0; i<result.length; i++){
          units.push(result[i]);
          
        }
        
      }
    });

  const Categories = db.collection('Categories');
  Categories.find({}).toArray((err1,result)=> {
    if(result != undefined){
      for(let i=0; i<result.length; i++){
        categories.push(result[i]);
      }
      
    }
  });

  

  const Inventory = db.collection('Inventory');
  Inventory.find({}).toArray((err1,result)=> {
    if(result != undefined){
      for(let i=0; i<result.length; i++){
        inventory.push(result[i]);
      }
      
    }
});

const Orders = db.collection('Orders');
Orders.find({}).toArray((err1,result)=> {
  if(result != undefined){
    for(let i=0; i<result.length; i++){
      orders.push(result[i]);
    }
    
  }
});

const Damaged = db.collection('Damaged');
Damaged.find({}).toArray((err1,result)=> {
  if(result != undefined){
    for(let i=0; i<result.length; i++){
      damaged.push(result[i]);
    }
    
  }
});

});


app.get('/api/status',(req,res) =>{
  res.send(status);
});

app.get('/api/units',(req,res) => {
  res.send(units);
});

app.post('/api/units/add',urlencodedParser,(req,res) =>{
  var uname = req.query.uname;
  var is_active = req.query.is_active;
  console.log('targeted');
  var count = 0;
  for(var i=0; i<units.length;i++){
    if(units[i].uname == uname){
      count ++;
    }
  }

  if(count == 0){
    units.push({
      uname: uname,
      is_active:is_active
    });

    client.connect(err => {
      const Units = client.db("InventoryManagement").collection("Units");
      var uobj = {
        uname: uname,
        is_active:is_active
      };
      Units.insertOne(uobj,(error,response) => {
        if(error) throw error;
        console.log("inserted!!");
      });
    });
  }

  res.send("inserted")
});

app.get('/api/units/:id',(req,res) => {
  var uname = req.params.id;
  for(var i = 0;i<units.length;i++){
    if(units[i].uname == uname){
      res.send(units[i]);
    }
  }
});

app.post('/api/unit/:id/update',(req,res) => {
  var uname = req.params.id;
  var is_active = req.query.is_active;
  console.log(req);
  for(var i = 0;i<units.length;i++){
    if(units[i].uname == uname){
      var uobj ={$set:{
        uname: uname,
        is_active:is_active
      }};
      client.connect(err => {
        const db = client.db("InventoryManagement");
        db.collection("Units").updateOne(units[i],uobj, function(err, obj) {
        if (err) throw err;
        units = units.filter(function(item) {
          if(item.uname == uname){
            item.is_active = is_active;
          }
          return item;
        })
        res.send(uname +" updated !!");
        });
      });
  }
  }
});

app.get('/api/unit/:id/delete',(req,res) => {
  var uname = req.params.id;
  for(var i = 0;i<units.length;i++){
    if(units[i].uname == uname){
      client.connect(err => {
        const db = client.db("InventoryManagement");
        db.collection("Units").deleteOne(units[i], function(err, obj) {
        if (err) throw err;
        units = units.filter(function(item) {
          return item.uname != uname;
        })
        console.log(units);
        res.send(uname +" deleted !!");
        });
      });
  }
  }
});

app.get('/api/categories',(req,res) => {
  res.send(categories);
});

app.post('/api/categories/add',urlencodedParser,(req,res) =>{
  var cname = req.query.cname;
  var is_active = req.query.is_active;
  console.log('targeted');
  var count = 0;
  for(var i=0; i<categories.length;i++){
    if(categories[i].cname == cname){
      count ++;
    }
  }

  if(count == 0){
    categories.push({
      cname: cname,
      is_active:is_active
    });

    client.connect(err => {
      const Categories = client.db("InventoryManagement").collection("Categories");
      var uobj = {
        cname: cname,
        is_active:is_active
      };
      Categories.insertOne(uobj,(error,response) => {
        if(error) throw error;
        console.log("inserted!!");
      });
    });
  }

  res.send("inserted")
});

app.get('/api/categorie/:id',(req,res) => {
  var cname = req.params.id;
  for(var i = 0;i<categories.length;i++){
    if(categories[i].cname == cname){
      res.send(categories[i]);
    }
  }
});

app.post('/api/categorie/:id/update',(req,res) => {
  var cname = req.params.id;
  var is_active = req.query.is_active;

  for(var i = 0;i<categories.length;i++){
    if(categories[i].cname == cname){
      var uobj ={$set:{
        cname: cname,
        is_active:is_active
      }};
      client.connect(err => {
        const db = client.db("InventoryManagement");
        db.collection("Categories").updateOne(categories[i],uobj, function(err, obj) {
        if (err) throw err;
        categories = categories.filter(function(item) {
          if(item.cname == cname){
            item.is_active = is_active;
          }
          return item;
        })
        res.send(cname +" updated !!");
        });
      });
  }
  }
});

app.get('/api/categorie/:id/delete',(req,res) => {
  var cname = req.params.id;
  for(var i = 0;i<categories.length;i++){
    if(categories[i].cname == cname){
      client.connect(err => {
        const db = client.db("InventoryManagement");
        db.collection("Categories").deleteOne(categories[i], function(err, obj) {
        if (err) throw err;
        categories = categories.filter(function(item) {
          return item.cname != cname;
        })
        console.log(categories);
        res.send(cname +" deleted !!");
        });
      });
  }
  }
});


app.get('/api/inventory',(req,res) => {
  res.send(inventory);
});

app.post('/api/inventory/add',urlencodedParser,(req,res) =>{
  var vcode = req.query.vcode
  var pname = req.query.pname;
  var uname = req.query.uname;
  console.log(vcode);
  var cname = req.query.cname;
  var qty = Number(req.query.qty);
  var ppi = Number(req.query.ppi);
  var tc = qty * ppi;
  var curr = req.query.curr;
  var exp_date = req.query.exp_date;

  var count = 0;
  for(var i=0; i<inventory.length;i++){
    if(inventory[i].pname == pname){
      count ++;
    }
  }

  if(count == 0){
    client.connect(err => {
      const Inventory = client.db("InventoryManagement").collection("Inventory");
      var uobj = {
      "_id":uuidv4(),
      "vendor_code": vcode,
        "pname": pname,
        "unit": uname,
        "category": cname,
        "qty": qty,
        "ppi": ppi,
        "tc": tc,
        "currency": curr,
        "exp_date": exp_date,
        "added_on": today
    };
    inventory.push(uobj);
    Inventory.insertOne(uobj,(error,response) => {
        if(error) throw error;
        console.log("inserted!!");
      });
    });
  }

  res.send("inserted")
});

app.get('/api/inventory/:id',(req,res) => {
  var obcode = req.params.id;
  for(var i = 0;i<inventory.length;i++){
    if(inventory[i]._id == obcode){
      res.send(inventory[i]);
    }
  }
});

app.post('/api/inventory/:id/update',(req,res) => {
  var obcode = req.params.id;
  var vcode = req.query.vcode
  var pname = req.query.pname;
  var uname = req.query.uname;
  var cname = req.query.cname;
  var qty = Number(req.query.qty);
  var ppi = Number(req.query.ppi);
  var tc = qty * ppi;
  var curr = req.query.curr;
  var exp_date = req.query.exp_date;
  var addedon = req.query.added_on;

  for(var i = 0;i<inventory.length;i++){
    if(inventory[i]._id == obcode){
      var uobj ={$set:{
      "_id":obcode,
      "vendor_code": vcode,
        "pname": pname,
        "unit": uname,
        "category": cname,
        "qty": qty,
        "ppi": ppi,
        "tc": tc,
        "currency": curr,
        "exp_date": exp_date,
        "added_on": addedon
    }};
    inventory[i] = {
      "_id":obcode,
      "vendor_code": vcode,
        "pname": pname,
        "unit": uname,
        "category": cname,
        "qty": qty,
        "ppi": ppi,
        "tc": tc,
        "currency": curr,
        "exp_date": exp_date,
        "added_on": addedon
    };
      client.connect(err => {
        const db = client.db("InventoryManagement");
        db.collection("Inventory").updateOne(inventory[i],uobj, function(err, obj) {
        if (err) throw err;
        res.send(obcode +" updated !!");
        });
      });
  }
  }
});

app.get('/api/inventory/:id/delete',(req,res) => {
  var obcode = req.params.id;
  for(var i = 0;i<inventory.length;i++){
    if(inventory[i]._id == obcode){
      client.connect(err => {
        const db = client.db("InventoryManagement");
        db.collection("Inventory").deleteOne(inventory[i], function(err, obj) {
        if (err) throw err;
        inventory = inventory.filter(function(item) {
          return item._id != obcode;
        })
        console.log(inventory);
        res.send(obcode +" deleted !!");
        });
      });
  }
  }
});


app.get('/api/orders',(req,res) => {
  res.send(orders);
});

app.get('/api/order/:id',(req,res) => {
  var oid = req.params.id;

  for(var i = 0; i < orders.length;i++){
    if(orders[i]._id == oid){
      res.send(orders[i]);
    }
  }
});

app.post('/api/orders/create',urlencodedParser,(req,res) =>{
  var id = uuidv4();
  var Ostring = req.query.OS;
  var details = Ostring.split(',');
  var cname = details[0];
  var sum = details[1];
  var Products = [];
  
  for(var i = 2; i <details.length; i++){
    if(details[i].length != 0 || details[i]!='' || details[i]!='\n'){
      var ps = details[i].split('_');
      var pname = ps[0];
      var qty = Number(ps[1]); 
      var tc = ps[2];

      if(qty!=0){
        Products.push({
          pname: pname,
          qty: qty,
          tc: tc,
        });

        var oobj = {
          "_id":id,
          "Cname":cname,
          "Date":today,
          "Products": Products,
          "tc":sum
         };
        client.connect(err => {
            const Orders = client.db("InventoryManagement").collection("Orders");
            orders.push(oobj);
            Orders.insertOne(oobj,(error,response) => {
                if(error) throw error;
                console.log("inserted!!");
              });
          });
      }
      
    }
  }

  
  res.send(oobj);
});

app.get('/api/damaged',(req,res) => {
  res.send(damaged);
});

app.get('/api/damaged/:id',(req,res) => {

  var id = req.params.id;

  for(var i = 0; i <damaged.length;i++){
    if(damaged[i]._id == id){
      res.send(damaged[i]);
    }
  }
});
//
app.post('/api/damaged/add',(req,res) => {

  var id = uuidv4();
  var vcode = req.query.vcode;
  var pname = req.query.pname;
  var dt = req.query.dt;
  var qty = Number(req.query.qty);
  var ppi = Number(req.query.ppi);
  var tc = qty * ppi;
  var on = today;

  var dobj = {
    "_id": id,
    "vendor_code": vcode,
    "pname": pname,
    "damage_type":dt,
    "qty": qty,
    "ppi": ppi,
    "tc": tc,
    "ON": on
  };

  client.connect(err => {
    const Damaged = client.db("InventoryManagement").collection("Damaged");
    damaged.push(dobj);
    Damaged.insertOne(dobj,(error,response) => {
        if(error) throw error;
        console.log("inserted!!");
      });
  });

  res.send(dobj);
});

app.post('/api/register',urlencodedParser,function(req, res){
  var name = req.query.name;
  var email = req.query.email;
  var password = req.query.pass;
  var count = 0;
  for(var i = 0;i<users.length;i++){
    if(users[i].email == email){
        count++;
    }
  }

  if(count == 0){
    users.push({
      user_name:name,
      user_email:email,
      password:password,
      is_admin:false,
      is_checker:false,
    });

    client.connect(err => {
      const collection = client.db("InventoryManagement").collection("Users");
      var userObj ={
        user_name:name,
        user_email:email,
        password:password,
        is_admin:false,
        is_checker:false,
      }
      console.log(userObj);
      collection.insertOne(userObj,(error,response) => {
        if(error) throw error;
        console.log("inserted!!");
       
      });
    });
  }
});

app.post('/api/login',urlencodedParser,(req,res1) =>{
  var email = req.query.email;
  var password = req.query.pass;

  for(var i = 0;i<users.length;i++){
    if(users[i].user_email == email && users[i].password == password){
      status.is_admin = users[i].is_admin;
      status.login_status = true;
      status.message ="success!!";
      status.user_name = users[i].user_name;
    }  
  }

  res1.send(status);

});

app.get('/api/logout',(req,res) =>{
  status.login_status = false;
  status.is_admin = false;
  status.user_name = "";
  console.log("logged out")
  status.message = "";
});







app.listen(port, () => console.log(`Listening on port ${port}`));

