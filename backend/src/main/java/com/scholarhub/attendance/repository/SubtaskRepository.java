package com.scholarhub.attendance.repository;

import com.scholarhub.attendance.entity.Subtask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SubtaskRepository extends JpaRepository<Subtask, Long> {

    List<Subtask> findByProjectMemberIdOrderByCreatedAtAsc(Long projectMemberId);

    @Query("SELECT s FROM Subtask s JOIN FETCH s.projectMember pm JOIN FETCH pm.project p JOIN FETCH pm.user u " +
           "WHERE pm.status = 'ACCEPTED' AND " +
           "s.completed = false AND " +
           "s.deadline < :currentDate AND " +
           "s.overdueNotified = false")
    List<Subtask> findOverdueSubtasks(@Param("currentDate") LocalDate currentDate);
}
