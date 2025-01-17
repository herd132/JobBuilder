package com.jobbuilder.project.myPageWorker.model.service;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.RowBounds;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.jobbuilder.project.board.model.dto.Board;
import com.jobbuilder.project.common.util.Utility;
import com.jobbuilder.project.myPageWorker.model.mapper.MyPageWorkerMapper;
import com.jobbuilder.project.worker.model.dto.Worker;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
@Slf4j
public class MyPageWorkerServiceImpl implements MyPageWorkerService {

	private final MyPageWorkerMapper mapper;
	private final BCryptPasswordEncoder bcrypt;

	@Value("${my.worker.profile.web-path}")
	private String profileWebPath;

	@Value("${my.worker.profile.folder-path}")
	private String profileFolderPath;

	/**
	 * 닉네임 중복검사
	 */
	@Override
	public int checkNickname(String workerNickname) {
		return mapper.checkNickname(workerNickname);
	}

	/**
	 * 연락처 중복검사
	 */
	@Override
	public int checkMemberTel(String memberTel) {
		return mapper.checkMemberTel(memberTel);
	}

	/**
	 * 비밀번호 확인
	 */
	@Override
	public int checkPw(String currentPassword, Worker loginWorker) {
		String originPw = mapper.checkPwSet(loginWorker.getMemberNo());
		if (!bcrypt.matches(currentPassword, originPw)) {
			return 0;
		}

		return 1;
	}

	/**
	 * 비밀번호 변경
	 */
	@Override
	public int workerChangePw(int memberNo, String workerPw) {
		String encPw = bcrypt.encode(workerPw);

		Map<String, Object> paramMap = new HashMap<>();

		paramMap.put("encPw", encPw);
		paramMap.put("memberNo", memberNo);

		return mapper.workerChangePw(paramMap);
	}

	/**
	 * 회원탈퇴
	 */
	@Override
	public int secession(Worker loginWorker) {
		int memberNo = loginWorker.getMemberNo();
		log.debug("memberNo : " + memberNo);
		return mapper.secession(memberNo);
		
	}
	
	@Override
	public int secessionResume(Worker loginWorker) {
		int workerNo = loginWorker.getWorkerNo();
		log.debug("workerNo : " + workerNo);
		return mapper.secessionResume(workerNo);
	}

	/**
	 * 정보 변경
	 * 
	 * @throws IOException
	 * @throws
	 */
	@Override
	public int updateInfo(Worker loginWorker, MultipartFile imageInput, String[] workerAddress, int status)
			throws Exception {

		if (!loginWorker.getWorkerAddress().equals(",,")) {

			String address = String.join("^^^", workerAddress);

			// 구분자로 "^^^" 쓴 이유 :
			// -> 주소, 상세주소에 없는 특수문자 작성
			// -> 나중에 마이페이지에서 주소 수정 시 다시 3분할 해야할 때 구분자로 이용할 예정
			// inputMember 주소로 합쳐진 주소를 세팅
			loginWorker.setWorkerAddress(address);

		} else {
			// 주소가 입력되지 않은 경우
			loginWorker.setWorkerAddress(null); // null 저장
		}

		// 프로필 이미지 경로 (수정할 경로)
		String updatePath = null;
		int result = 0;

		// 변경명 저장
		String rename = null;

		// 업로드한 이미지가 있을 경우
		// - 있을 경우 : 경로 조합 (클라이언트 접근 경로 + 리네임파일명)
		if (!imageInput.isEmpty()) {
			// updatePath 경로 조합

			// 1. 파일명 변경
			rename = Utility.fileRename(imageInput.getOriginalFilename());

			// 2. /myPage/profile/변경된파일명
			updatePath = profileWebPath + rename;

			loginWorker.setProfileImg(updatePath);
			int memberResult = mapper.updateInfoMember(loginWorker);
			result = mapper.updateInfoWorker(loginWorker);
		} else if (status == -1) {
			loginWorker.setProfileImg(loginWorker.getProfileImg());
			int memberResult = mapper.updateInfoMember(loginWorker);
			result = mapper.updateInfoWorker(loginWorker);
		} else if( status == 0) {
			loginWorker.setProfileImg(null);
			int memberResult = mapper.updateInfoMember(loginWorker);
			result = mapper.updateInfoWorker(loginWorker);
		}

		if (result > 0) { // DB에 수정 성공

			// 프로필 이미지를 없앤 경우(NULL로 수정한 경우)를 제외
			// -> 업로드한 이미지가 있을 경우
			if (!imageInput.isEmpty()) {
				// 파일을 서버 지정된 폴더에 저장
				imageInput.transferTo(new File(profileFolderPath + rename));
				// C:/uploadFiles/profile/변경한이름
			}

		}

		return result;
	}

	// 작성 글 제목 불러오기
	@Override
	public List<Board> writeView(int memberNo,int cp) {
		
		int limit = 14;
		int offset = (cp - 1) * limit;
		RowBounds rowBounds =  new RowBounds(offset, limit);
		
		return mapper.writeView(memberNo, rowBounds);
	}




}
