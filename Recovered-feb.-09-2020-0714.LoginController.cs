using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using appusuario3.Data;
using appusuario3.DTOS;
using appusuario3.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;


namespace appusuario3.Controllers
{

    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly MyContext mycontext;
        private UserManager<ApplicationUser> _userManager;
        private SignInManager<ApplicationUser> _singInManager;
        private readonly AppSettings _appSettings;

        public LoginController(UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IOptions<AppSettings>appSettings, MyContext context)
        {

            _userManager = userManager;
            _singInManager = signInManager;
            _appSettings = appSettings.Value;
            mycontext = context;
        }


        [AllowAnonymous]
        [HttpPost("authenticate")]

        public async Task<Object> Post(AuthenticateModel model)
        {
            var user = new ApplicationUser()
            {
                UserName = model.Username,
                Email = model.Email,
                Password = model.Password
                
            }; 


            try
            {
                var oldUser = await _userManager.FindByNameAsync(model.Username);
                if (oldUser != null)
                {
                    return BadRequest(new { message = "Nombre de usuario ya existe" });
                }

                if (string.IsNullOrWhiteSpace(user.UserName) || string.IsNullOrWhiteSpace(user.Password) || string.IsNullOrWhiteSpace(user.Email))
                {
                    return BadRequest(new { message = "Ningun campo puede ser vacio" });
                }

                //TODO: Valida si ya hay un usuario con el mismo nombre de usuario y/o email.

                var result = await _userManager.CreateAsync(user, model.Password);
                return Ok(result);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<object> Login(AuthenticateModel model)
        {
            var result = await _singInManager.PasswordSignInAsync(model.Username, model.Password, false, false);

            if (result.Succeeded)
            {
                var appUser = _userManager.Users.SingleOrDefault(r => r.Email == model.Email);
                return await GenerateJwtToken(model.Email, appUser);
            }

            throw new ApplicationException("INVALID_LOGIN_ATTEMPT");
        }

        private async Task<object> GenerateJwtToken(string email, IdentityUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier, user.Id)
            };

            var keyjwt = "uFS8AUSsQVEfHnxpkfF1RcoZpSokzNW6r6M_yZHkSk1cHFBcs0oYj5vaIVVJfBShthX5SYcl1B-xhBobOjOyd5xdcroGEkuXjutwauHmT4bhf8OomDG2I4rAw-98HpdhgStJHutjLGE52WlAloWwlDqRmKU9DFw6JUfF_iZSG6s";

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyjwt));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.Now.AddDays(Convert.ToDouble(2));

            var token = new JwtSecurityToken(
                "miapp",
                "miapp2",
                claims,
                expires: expires,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        [Authorize]
        [HttpGet]
        public async Task<object> GetUserProfile()
        {
            var identity = (ClaimsIdentity)User.Identity;
            var Email = identity.Claims.FirstOrDefault(c => c.Type == "Email").Value;

            var user = await _userManager.FindByEmailAsync(Email);

            return new
            {
                user.UserName,
                user.Email,
                user.Password
            };

        }



        [AllowAnonymous]
        [HttpPost("token")]
        public async Task<IActionResult> Login2(AuthenticateModel model)
        {
            // map model to entity
            var user = await _userManager.FindByNameAsync(model.Username);
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var tokenDescriptior = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UsuarioID", user.Id.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddMinutes(5),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                };
                var tokenHandler = new JwtSecurityTokenHandler();
                var securiryToken = tokenHandler.CreateToken(tokenDescriptior);
                var token = tokenHandler.WriteToken(securiryToken);
                await _singInManager.SignInAsync(user, isPersistent: false);
                return Ok(new { token });
            }
            else
                return BadRequest(new { message = "Usuario o contraseña incorrecta." });
        }

    }
}