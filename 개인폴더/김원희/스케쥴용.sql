BEGIN
    DBMS_SCHEDULER.CREATE_JOB (
        job_name        => 'UPDATE_MEMBERSHIP_DEL_FLAG_JOB', -- 매일 0시에 맴버십 비활성화
        job_type        => 'PLSQL_BLOCK',
        job_action      => '
            BEGIN
                UPDATE MEMBERSHIP
                SET MEMBERSHIP_DEL_FL = ''Y''
                WHERE MEMBERSHIP_END_DATE < TRUNC(SYSDATE) 
                AND MEMBERSHIP_DEL_FL = ''N'';
            END;',
        start_date      => SYSTIMESTAMP,
        repeat_interval => 'FREQ=DAILY; BYHOUR=0; BYMINUTE=0; BYSECOND=0',
        enabled         => TRUE
    );
END;


--BEGIN
--    DBMS_SCHEDULER.CREATE_JOB (
--        job_name        => 'UPDATE_RECRUITMENT_DEL_FLAG_JOB', -- 매일 0시에 실행
--        job_type        => 'PLSQL_BLOCK',
--        job_action      => '
--            BEGIN
--                UPDATE RECRUITMENT
--                SET RECRUITMENT_DEL_FL = ''Y''
--                WHERE RECRUITMENT_DEADLINE < TRUNC(SYSDATE) 
--                AND RECRUITMENT_DEL_FL = ''N'';
--            END;',
--        start_date      => SYSTIMESTAMP,
--        repeat_interval => 'FREQ=DAILY; BYHOUR=0; BYMINUTE=0; BYSECOND=0',
--        enabled         => TRUE
--    );
--END;




SELECT *
FROM MEMBERSHIP AS OF TIMESTAMP (SYSTIMESTAMP - INTERVAL '30' MINUTE)
WHERE MEMBERSHIP_DEL_FL = 'N'
ORDER BY MEMBERSHIP_END_DATE DESC;




BEGIN
    DBMS_SCHEDULER.DISABLE('UPDATE_MEMBERSHIP_DEL_FLAG_JOB');
END;
-- 비활성화



BEGIN
    DBMS_SCHEDULER.SET_ATTRIBUTE(
        name       => 'UPDATE_MEMBERSHIP_DEL_FLAG_JOB',
        attribute  => 'START_DATE',
        value      => SYSTIMESTAMP + INTERVAL '2' MINUTE
    );
END;

-- 2분으로 변경


BEGIN
    DBMS_SCHEDULER.SET_ATTRIBUTE(
        name       => 'UPDATE_MEMBERSHIP_DEL_FLAG_JOB',
        attribute  => 'REPEAT_INTERVAL',
        value      => 'FREQ=DAILY; BYHOUR=0; BYMINUTE=0; BYSECOND=0'
    );
END;


-- 다시 되돌릴때


BEGIN
    DBMS_SCHEDULER.ENABLE('UPDATE_MEMBERSHIP_DEL_FLAG_JOB');
END;

-- 재활성화


SELECT LOG_DATE, STATUS, ERROR#, RUN_DURATION, ADDITIONAL_INFO
FROM DBA_SCHEDULER_JOB_LOG
WHERE JOB_NAME = 'UPDATE_MEMBERSHIP_DEL_FLAG_JOB'
ORDER BY LOG_DATE DESC;
-- 결과 확인




SELECT *
FROM DBA_SCHEDULER_JOB_LOG
WHERE JOB_NAME = 'UPDATE_MEMBERSHIP_DEL_FLAG_JOB'
AND ROWNUM <= 1
ORDER BY LOG_DATE DESC;
-- 제일 마지막 확인