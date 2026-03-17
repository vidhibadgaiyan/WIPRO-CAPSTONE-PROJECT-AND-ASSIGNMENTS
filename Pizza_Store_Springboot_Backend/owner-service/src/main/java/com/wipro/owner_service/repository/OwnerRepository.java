package com.wipro.owner_service.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.wipro.owner_service.entity.Owner;

public interface OwnerRepository extends JpaRepository<Owner,Long>{

Optional<Owner> findByEmail(String email);

}