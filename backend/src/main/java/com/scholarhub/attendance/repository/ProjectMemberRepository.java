package com.scholarhub.attendance.repository;

import com.scholarhub.attendance.entity.MemberStatus;
import com.scholarhub.attendance.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    Optional<ProjectMember> findByProjectIdAndUserId(Long projectId, Long userId);

    List<ProjectMember> findByProjectId(Long projectId);

    List<ProjectMember> findByProjectIdAndStatus(Long projectId, MemberStatus status);

    long countByProjectIdAndStatusIn(Long projectId, Collection<MemberStatus> statuses);

    @Query("SELECT pm FROM ProjectMember pm WHERE " +
           "pm.status = 'ACCEPTED' AND " +
           "pm.overallTask IS NOT NULL AND " +
           "pm.overallTaskCompleted = false AND " +
           "pm.overallTaskDeadline < :currentDate AND " +
           "pm.overdueNotified = false")
    List<ProjectMember> findOverdueOverallTasks(@Param("currentDate") LocalDate currentDate);
}
