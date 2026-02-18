package com.waw.waw.repository;

import com.waw.waw.entity.ArticleIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArticleIndexRepository extends JpaRepository<ArticleIndex, Long> {
    // Tu peux ajouter des méthodes personnalisées si besoin
}
