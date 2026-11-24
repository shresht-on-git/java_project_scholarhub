package com.scholarhub.attendance.service;

import com.scholarhub.attendance.entity.NotificationType;
import com.scholarhub.attendance.entity.ProjectMember;
import com.scholarhub.attendance.entity.Subtask;
import com.scholarhub.attendance.repository.ProjectMemberRepository;
import com.scholarhub.attendance.repository.SubtaskRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Component
public class OverdueNotificationScheduler {

    private static final Logger log = LoggerFactory.getLogger(OverdueNotificationScheduler.class);
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd MMM yyyy");

    private final SubtaskRepository subtaskRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final NotificationService notificationService;

    public OverdueNotificationScheduler(SubtaskRepository subtaskRepository,
                                        ProjectMemberRepository projectMemberRepository,
                                        NotificationService notificationService) {
        this.subtaskRepository = subtaskRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.notificationService = notificationService;
    }

    /**
     * Runs every 1 minute to check for overdue subtasks and overall tasks,
     * and alerts all accepted team members once per missed deadline.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkOverdueDeadlines() {
        LocalDate today = LocalDate.now();

        // 1. Check Overdue Subtasks
        List<Subtask> overdueSubtasks = subtaskRepository.findOverdueSubtasks(today);
        for (Subtask subtask : overdueSubtasks) {
            ProjectMember member = subtask.getProjectMember();
            String formattedDate = subtask.getDeadline().format(DATE_FORMATTER);
            String message = member.getUser().getFullName() + " has not completed their '" +
                    subtask.getTitle() + "' subtask under the desired deadline (" + formattedDate + ").";

            notificationService.notifyAllAcceptedMembers(member.getProject(), message, NotificationType.SUBTASK_OVERDUE);
            subtask.setOverdueNotified(true);
            subtaskRepository.save(subtask);
            log.info("Sent overdue notification for subtask id {}: {}", subtask.getId(), message);
        }

        // 2. Check Overdue Overall Tasks
        List<ProjectMember> overdueMembers = projectMemberRepository.findOverdueOverallTasks(today);
        for (ProjectMember member : overdueMembers) {
            String formattedDate = member.getOverallTaskDeadline().format(DATE_FORMATTER);
            String message = member.getUser().getFullName() + " has not completed their overall task '" +
                    member.getOverallTask() + "' under the desired deadline (" + formattedDate + ").";

            notificationService.notifyAllAcceptedMembers(member.getProject(), message, NotificationType.TASK_OVERDUE);
            member.setOverdueNotified(true);
            projectMemberRepository.save(member);
            log.info("Sent overdue notification for overall task member id {}: {}", member.getId(), message);
        }
    }
}
