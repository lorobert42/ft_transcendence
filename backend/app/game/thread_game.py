
import threading

class threadPool:

    threads = {}

    @classmethod
    def add_game(cls, game_room_name, consumers_instance):
        cls.threads[game_room_name] = {
            "thread": threading.Thread(target=consumers_instance.start_game),
            "count": False,
        }
        threads = cls.threads[game_room_name]["thread"]
        threads.deamon = True
        threads.start()
