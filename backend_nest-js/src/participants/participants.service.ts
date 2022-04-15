import { Injectable } from '@nestjs/common';
import { CreateParticipantDto } from './dto/create-participant.dto';
import { UpdateParticipantDto } from './dto/update-participant.dto';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ParticipantService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async create(createParticipantDto: CreateParticipantDto) {
    const participantRef = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .add(createParticipantDto);

    const participant = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .doc(participantRef.id)
      .get();

    return {
      id: participantRef.id,
      name: participant.data().name,
      email: participant.data().email,
      status: participant.data().status,
    };
  }

  async findAll() {
    const participantRef = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .get();

    const listParticipants = [];

    participantRef.forEach((doc) => {
      listParticipants.push({
        id: doc.id,
        name: doc.data().name,
        email: doc.data().email,
        status: doc.data().status,
      });
    });

    return listParticipants;
  }

  async findOne(id: string) {
    const participantRef = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .doc(id)
      .get();

    if (!participantRef.exists) return null;

    return {
      id: id,
      name: participantRef.data().name,
      email: participantRef.data().email,
      status: participantRef.data().status,
    };
  }

  async findByEmail(email: string) {
    const participantRef = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .where('email', '==', email)
      .get();

    if (participantRef.empty) {
      return null;
    }

    return {
      id: participantRef.docs[0].id,
      name: participantRef.docs[0].data().name,
      email: participantRef.docs[0].data().email,
      status: participantRef.docs[0].data().status,
    };
  }

  async update(id: string, updateParticipantDto: UpdateParticipantDto) {
    const participantRef = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .doc(id)
      .update({
        name: updateParticipantDto.name,
        email: updateParticipantDto.email,
        status: updateParticipantDto.status,
      });

    const participant = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .doc(id)
      .get();

    return {
      id: id,
      name: participant.data().name,
      email: participant.data().email,
      status: participant.data().status,
    };
  }

  async remove(id: string) {
    const participant = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .doc(id)
      .get();

    if (!participant.exists) return null;

    const participantRef = await this.firebaseService
      .getFirestore()
      .collection('participants')
      .doc(id)
      .delete();

    return {
      id: id,
      name: participant.data().name,
      email: participant.data().email,
      status: participant.data().status,
    };
  }
}
