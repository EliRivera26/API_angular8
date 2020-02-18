using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using appusuario3.DTOS;
using appusuario3.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using appusuario3.Helpers;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Net.Mime;

namespace appusuario3
{
    public class Startup
    {
        readonly string MyAllowSpecificOrigins = "_myAllowSpecificOrigins";
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            
            var appSettingsSection = Configuration.GetSection("AppSettings");
            services.Configure<AppSettings>(appSettingsSection);

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            var key = Encoding.ASCII.GetBytes(appSettings.Secret);

            services.AddDbContext<MyContext>(opt =>
                    opt.UseMySql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddDbContext<ApplicationDbContext>();

            services.AddCors(options =>
            {
                options.AddPolicy(MyAllowSpecificOrigins,
                builder =>
                {
                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                    builder.AllowAnyOrigin();
                });
            });
       
            services.AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            var keyjwt = "uFS8AUSsQVEfHnxpkfF1RcoZpSokzNW6r6M_yZHkSk1cHFBcs0oYj5vaIVVJfBShthX5SYcl1B-xhBobOjOyd5xdcroGEkuXjutwauHmT4bhf8OomDG2I4rAw-98HpdhgStJHutjLGE52WlAloWwlDqRmKU9DFw6JUfF_iZSG6s";
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear(); // => remove default claims
            services
                .AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

                })
                .AddJwtBearer(cfg =>
                {
                    cfg.RequireHttpsMetadata = false;
                    cfg.SaveToken = true;
                    cfg.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidIssuer = "miapp",
                        ValidAudience = "miapp2",
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyjwt)),
                        ClockSkew = TimeSpan.Zero // remove delay of token when expire
                    };
                });


            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_1);
            

        
        //services.AddTransient<MySqlDatabase>(_ => new MySqlDatabase("server=127.0.0.1; database=dbusers; uid=root; pwd="));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, MyContext dbContext)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseAuthentication();
            app.UseCors(MyAllowSpecificOrigins);
            app.UseMvc();
            //dbContext.Database.EnsureCreated();

        }
    }
}
