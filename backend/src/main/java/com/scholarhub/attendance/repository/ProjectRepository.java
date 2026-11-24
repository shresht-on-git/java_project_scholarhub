package com.scholarhub.attendance.repository;

import com.scholarhub.attendance.entity.MemberStatus;
import com.scholarhub.attendance.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.user.id = :userId AND m.status = :status ORDER BY p.createdAt DESC")
    List<Project> findProjectsByMemberUserIdAndStatus(@Param("userId") Long userId, @Param("status") MemberStatus status);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.members m WHERE m.user.id = :userId AND m.status = 'PENDING' ORDER BY p.createdAt DESC")
    List<Project> findPendingInvitationsByUserId(@Param("userId") Long userId);
}
