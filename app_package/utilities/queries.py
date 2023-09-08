from sqlalchemy import text

def leaderboards_query(key):
    return text(
            "SELECT users.username, tests.wpm, tests.accuracy, tests.date "
            "FROM users AS users "
            "INNER JOIN tests AS tests "
            "ON users.id = tests.user_id "
            "AND (tests.user_id, tests.wpm) IN ("
                "SELECT t1.user_id, MAX(t1.wpm) wpm "
                "FROM ("
                    "SELECT user_id, wpm "
                    "FROM tests "
                    "WHERE state = 'completed' "
                    f"AND time = {int(key)}"
                ") AS t1 "
                "GROUP BY t1.user_id) "
            "ORDER BY wpm DESC, accuracy DESC, date ASC "
            "LIMIT 10;")

def highscores_query(user_id, mode) :
    return text(
        f"SELECT {mode}, MAX(wpm) wpm "
        "FROM tests "
        f"WHERE user_id={user_id} "
        f"AND state='completed'"
        f"AND MODE='{mode}' "
        f"GROUP BY {mode};"
    )

def stats_tests_query(user_id, state) :
    if state == 'started':
        return text(
            "SELECT COUNT(*) as count "
            "FROM tests "
            f"WHERE user_id={user_id}; "
        )
    else :
        return text(
            "SELECT COUNT(*) as count "
            "FROM tests "
            f"WHERE user_id={user_id} "
            f"AND state='{state}';"
        )      

def stats_query(user_id, quantity = 0) :
    if quantity <= 0:
        return text(
        "SELECT AVG(wpm) wpm, AVG(raw_wpm) raw_wpm, AVG(accuracy) accuracy "
        "FROM tests "
        f"WHERE user_id={user_id} "
        "AND state='completed' "
    )
    else:
        return text(
            "SELECT AVG(wpm) wpm, AVG(raw_wpm) raw_wpm, AVG(accuracy) accuracy "
            "FROM "
                "(SELECT accuracy, wpm, raw_wpm FROM tests "
                f"WHERE user_id={user_id} "
                "AND state='completed' "
                "ORDER BY date DESC "
                f"LIMIT {quantity}) "
            "as tests1;"
    )

def history_query(user_id, quantity) :
    return text(
        "SELECT mode, language, time, words, wpm, raw_wpm, accuracy, date, chars_correct_correctword, chars_correct_incorrectword, chars_incorrect, chars_extra, chars_missed "
        "FROM tests "
        f"WHERE user_id={user_id} "
        "AND state='completed' "
        "ORDER BY date DESC "
        f"LIMIT {quantity};"
    )