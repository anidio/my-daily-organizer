package com.mydailyorganizer.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 2. Habilita a configuração de CORS definida abaixo
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // 1. Desabilita a proteção CSRF (a causa principal do erro 405)
                .csrf(csrf -> csrf.disable())
                // 3. Define as regras de autorização para os endpoints
                .authorizeHttpRequests(auth -> auth
                        // Permite acesso a todos os endpoints da sua API sem autenticação
                        .requestMatchers("/api/**").permitAll()
                        // Qualquer outra requisição precisa de autenticação (opcional por enquanto)
                        .anyRequest().authenticated()
                );
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Permite requisições destas origens (seu frontend em dev e prod)
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://localhost:5173", // Adicione esta se usar Vite com a porta padrão
                "https://my-daily-organizer.vercel.app"
        ));

        // Permite os métodos HTTP que seu frontend usa
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Permite todos os headers na requisição
        configuration.setAllowedHeaders(List.of("*"));

        // Permite o envio de credenciais (cookies, etc)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Aplica esta configuração de CORS para todas as rotas da aplicação
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}