package com.event.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.event.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

}