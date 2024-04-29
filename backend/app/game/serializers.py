from rest_framework import serializers
from django.db import transaction
import random

from core.models import Game, Tournament, User, Participation, GameInvitation

class GameUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']  # Adjust fields based on the actual User model



class GameScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['score1', 'score2', 'is_draft', 'is_finished']  # Only include the fields that can be updated
        extra_kwargs = {
            'score1': {'required': False},
            'score2': {'required': False},
            'is_draft' : {'required': False},
            'is_finished' : {'required': False},
        }


class GameScoreUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['score1', 'score2',  'is_finished']
        extra_kwargs = {
            'score1': {'required': False},
            'score2': {'required': False},
            'is_finished': {'required': False},
        }

    def update(self, instance, validated_data):
        # Update the current game instance first
        instance = super().update(instance, validated_data)

        # Check if the game just finished and it's a part of a tournament
        if instance.is_finished and instance.tournament:
            # Logic to update the next game with winners
            self.set_next_game_players(instance)

        return instance

    def set_next_game_players(self, finished_game):
        tournament = finished_game.tournament
        games = Game.objects.filter(tournament=tournament).order_by('id')

        if finished_game == games[0]:  # If it's the first game
            next_game = games[2]  # Final game in a 4-player setup
            winner = finished_game.player1 if finished_game.score1 > finished_game.score2 else finished_game.player2
            next_game.player1 = winner
        elif finished_game == games[1]:  # If it's the second game
            next_game = games[2]  # Final game in a 4-player setup
            winner = finished_game.player1 if finished_game.score1 > finished_game.score2 else finished_game.player2
            next_game.player2 = winner

        next_game.save()

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = ['id', 'tournament', 'player1', 'player2', 'score1', 'score2', 'is_draft', 'is_finished']


    def validate(self, data):
        """
        Check that the two players are not the same and that both are in the tournament if applicable.
        """
        if data['player1'] is not None and data['player2'] is not None and data['player1'] == data['player2']:
            raise serializers.ValidationError("Player1 and Player2 cannot be the same person.")

        tournament = data.get('tournament')  # Use .get() to avoid KeyError
        if tournament:
            tournament_participants = tournament.participants.all()
            if not (data['player1'] in tournament_participants and data['player2'] in tournament_participants):
                raise serializers.ValidationError("Both players must be participants in the tournament.")

        return data

    def update(self, instance, validated_data):
        instance.score1 = validated_data.get('score1', instance.score1)
        instance.score2 = validated_data.get('score2', instance.score2)
        instance.is_finished = validated_data.get('is_finished', instance.is_finished)
        instance.save()
        return instance

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email']  # Adjust fields based on the actual User model


class ParticipationSerializer(serializers.ModelSerializer):
    user = CustomUserSerializer(read_only=True)  # Embed user details

    class Meta:
        model = Participation
        fields = ['id', 'user', 'tournament', 'status']

    def validate(self, data):
        # Check if the Participation already exists
        if Participation.objects.filter(user=data['user'], tournament=data['tournament']).exists():
            raise serializers.ValidationError("This user is already registered in this tournament.")
        return data

    def create(self, validated_data):
        # Create a new participation instance with the validated data
        participation = Participation.objects.create(**validated_data)
        return participation



class TournamentSerializer(serializers.ModelSerializer):
    participants = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=True,
        write_only=True
    )

    class Meta:
        model = Tournament
        fields = ['id', 'name', 'participants']

    def validate_participants(self, participants):
        if len(set(participants)) not in [4, 8]:
            raise serializers.ValidationError("A tournament must have exactly 4 or 8 unique participants.")
        return participants

    def create(self, validated_data):
        participants_data = validated_data.pop('participants')
        if len(participants_data) not in [4, 8]:
            raise serializers.ValidationError("A tournament must have either four or eight participants.")

        with transaction.atomic():
            tournament = Tournament.objects.create(**validated_data)
            self.create_initial_games(tournament, participants_data)

            # Add participants to the tournament through Participation instances
            for user in participants_data:
                Participation.objects.create(user=user, tournament=tournament)

        return tournament

    def create_initial_games(self, tournament, participants):
        random.shuffle(participants)  # Randomize participants or sort them as needed
        if len(participants) == 4:
            game1 = Game.objects.create(tournament=tournament, player1=participants[0], player2=participants[1])
            game2 = Game.objects.create(tournament=tournament, player1=participants[2], player2=participants[3])
            # Final game placeholder
            game_final = Game.objects.create(tournament=tournament, player1=None, player2=None)
        elif len(participants) == 8:
            # Set up quarter-finals
            games = []
            for i in range(0, 8, 2):
                game = Game.objects.create(tournament=tournament, player1=participants[i], player2=participants[i+1])
                games.append(game)
            # Semi-finals and final game placeholders
            game_semi_final_1 = Game.objects.create(tournament=tournament, player1=None, player2=None)
            game_semi_final_2 = Game.objects.create(tournament=tournament, player1=None, player2=None)
            game_final = Game.objects.create(tournament=tournament, player1=None, player2=None)

    def to_representation(self, instance):
        # Custom representation to show participants
        representation = super().to_representation(instance)
        participation_set = Participation.objects.filter(tournament=instance)
        representation['participants'] = ParticipationSerializer(participation_set, many=True).data
        return representation




class GameInvitationSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameInvitation
        fields = '__all__'

    def validate(self, data):
        if data['player1'] == data['player2']:
            raise serializers.ValidationError("Player1 and Player2 cannot be the same person.")
        return data