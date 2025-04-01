package com.ritika_chandak.backend_java.Service;

import com.ritika_chandak.backend_java.Model.HRDTO;
import com.ritika_chandak.backend_java.Repository.HRRepository;
import org.springframework.stereotype.Service;
import java.util.Optional;

public interface HRService {
    Optional<HRDTO> login(String email, String password);
}

@Service
class HRServiceImpl implements HRService {
    private final HRRepository hrRepository;

    public HRServiceImpl(HRRepository hrRepository) {
        this.hrRepository = hrRepository;
    }

    @Override
    public Optional<HRDTO> login(String email, String password) {
        return hrRepository.findByEmail(email)
                .filter(hr -> hr.getPassword().equals(password))
                .map(hr -> new HRDTO(hr.getId(), hr.getEmail(), hr.getPassword()));
    }
}
