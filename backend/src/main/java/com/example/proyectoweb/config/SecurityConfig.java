package com.example.proyectoweb.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import static org.springframework.http.HttpMethod.DELETE;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.http.HttpMethod.POST;
import static org.springframework.http.HttpMethod.PUT;
import org.springframework.security.authentication.AuthenticationProvider;
import static org.springframework.security.config.Customizer.withDefaults;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static com.example.proyectoweb.entity.Permission.ADMIN_DELETE;
import static com.example.proyectoweb.entity.Permission.ADMIN_READ;
import static com.example.proyectoweb.entity.Permission.ADMIN_UPDATE;
import static com.example.proyectoweb.entity.Permission.ADMIN_WRITE;

import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletResponse;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig implements WebMvcConfigurer {

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    private final AuthenticationProvider authProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable) // Deshabilitar CSRF para APIs sin estado
                .authorizeHttpRequests(authRequest -> authRequest
                        .requestMatchers("/auth/**", "/process_payment").permitAll() // Permitir acceso sin
                                                                                     // autenticación
                        .requestMatchers(GET, "api/v1/eventos", "api/v1/eventos/**").permitAll() // Permitir ver eventos
                                                                                                 // sin autenticación
                        .requestMatchers(GET, "/api/v1/hitos", "/api/v1/hitos/**").permitAll() // Permitir ver hitos sin
                                                                                             // autenticación

                        .requestMatchers(GET, "/api/v1/organizador/**")
                        .hasAuthority(ADMIN_READ.name())
                        .requestMatchers(POST, "/api/v1/organizador/**")
                        .hasAuthority(ADMIN_WRITE.name())
                        .requestMatchers(PUT, "/api/v1/organizador/**")
                        .hasAuthority(ADMIN_UPDATE.name())
                        .requestMatchers(DELETE, "/api/v1/organizador/**")
                        .hasAuthority(ADMIN_DELETE.name())
                        .requestMatchers(GET, "/api/v1/usuario/perfil").authenticated()
                        .requestMatchers(GET, "/api/v1/usuario/mis-eventos").authenticated()

                        .anyRequest().authenticated())
                .cors(withDefaults())
                .sessionManagement(sessionManager -> sessionManager
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // Deshabilitar manejo de sesiones
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.getWriter().write("{\"error\":\"Necesitas iniciar sesión para acceder a este recurso\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                            response.getWriter().write("{\"error\":\"No tienes permisos para acceder a este recurso\"}");
                        })
                )
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

}