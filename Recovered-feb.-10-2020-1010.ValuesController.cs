using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using appusuario3.Data;
using appusuario3.DTOS;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using NHibernate;
using dto = appusuario3.DTOS;

namespace appusuario3.Controllers
{
    [Route("api/[controller]")]
  
    [ApiController]
    public class ValuesController : ControllerBase
    {

        private ISession session;
        private readonly MyContext mycontext;

        public ValuesController(MyContext context)
        {
            mycontext = context;
            //session = SesionFactory.OpenSession;

        }

        [Authorize]
        [HttpGet]
        public async Task<object> Get()
        {
            if (User.Identity.Name != null)
            {
                return Authorization(JwtBearerDefaults);
            }
            else
            {
                return BadRequest(new { message = "Autenticación invalida" });
            }
        }

        // GET api/values
        [HttpGet]
        public ActionResult<IList<Usuario>> Get(string order)
        {
            
            var usuarios = mycontext.Usuarios.OrderByDescending(x=> x.Id).ToList();
            /*IQuery query = session.CreateQuery("FROM users");
            IList<Usuario> users = query.List<Usuario>();
            var usuarios = users.ToList();*/
            return usuarios;

        }

        // GET api/values/5
        [HttpGet("{id}")]
        public ActionResult<Usuario> Get(int id)
        {
        
            var user = mycontext.Usuarios.Find(id);
            return user;
        }

        // POST api/values
        [HttpPost]
        public ActionResult<Respons> Post([FromBody] Usuario usuario)
        {
            var user = mycontext.Usuarios.FirstOrDefault(x => x.Telefono== usuario.Telefono);
            var response = new Respons();

            if(user==null) {
                mycontext.Add(usuario);
                mycontext.SaveChanges();
                 return new Respons { Succes = true, Modelo = usuario };
            }
            else
            {
                return new Respons { Succes = false, Modelo = usuario, Errors = "Este telefono ya existe" };
            }
           

        }

        // PUT api/values/5
        [HttpPut("{id}")]
        public ActionResult<Respons> Put(int id, [FromBody] Usuario value)
        {
            var user = new Usuario();
            try
            {
                user = mycontext.Usuarios.Find(id);
                mycontext.Entry(user).CurrentValues.SetValues(value);
                mycontext.SaveChanges();
               
            }
            catch
            {
                return new Respons { Succes = false, Errors = "no se pudo actualizar el usuario" };
            }

            return new Respons { Succes = true, Modelo = user };
        }

        // DELETE api/values/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            var user = mycontext.Usuarios.Find(id);

            if(user.Id > 0)
            {
                mycontext.Remove(user);
                mycontext.SaveChanges();
            }
            
        }
    }
}
