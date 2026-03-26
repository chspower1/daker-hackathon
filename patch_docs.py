with open("docs/core-features.md", "r") as f:
    core_features = f.read()

old_status = "- 입력: 사용자가 상태 필터 버튼을 선택한다 -> 동작: `upcoming`, `ongoing`, `ended`, `all` 기준으로 목록을 다시 계산한다 -> 결과: 조건에 맞는 해커톤만 남는다."
new_status = "- 입력: 사용자가 상태 필터 버튼을 선택한다 -> 동작: `upcoming`, `ongoing`, `ended`, `all` 기준으로 목록을 다시 계산하며 각 상태별 현재 필터링된 개수를 표시한다 -> 결과: 조건에 맞는 해커톤만 남고 예상 개수를 미리 알 수 있다."

old_tag = "- 입력: 사용자가 태그 버튼을 선택한다 -> 동작: 선택한 태그를 포함한 항목만 필터링한다 -> 결과: 관심 분야에 맞는 해커톤만 볼 수 있다."
new_tag = "- 입력: 사용자가 태그 버튼을 선택한다 -> 동작: 다중 선택(Toggle)이 가능하며, 선택된 태그 중 하나라도 포함된(OR 조건) 해커톤만 필터링한다. 이미 선택된 태그를 다시 누르면 해제되고, 'All tags'를 누르면 모든 태그 선택이 해제된다 -> 결과: 여러 관심 분야에 맞는 해커톤을 유연하게 탐색할 수 있다."

core_features = core_features.replace(old_status, new_status)
core_features = core_features.replace(old_tag, new_tag)

with open("docs/core-features.md", "w") as f:
    f.write(core_features)

with open("docs/page-structure.md", "r") as f:
    page_structure = f.read()

old_ps = "상태 필터 선택, 태그 선택, 필터 초기화, 카드 클릭으로 상세 이동이 가능하다."
new_ps = "상태 필터(건수 표시) 선택, 태그 다중 선택(Toggle 및 전체 해제), 필터 초기화, 카드 클릭으로 상세 이동이 가능하다."

page_structure = page_structure.replace(old_ps, new_ps)

with open("docs/page-structure.md", "w") as f:
    f.write(page_structure)

print("Docs patched")
