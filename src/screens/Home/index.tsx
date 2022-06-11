import React, { useEffect, useRef, useState } from 'react';
import { FlatList } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { Q } from '@nozbe/watermelondb'

import { Menu, MenuTypeProps } from '../../components/Menu';
import { Skill } from '../../components/Skill';
import { Button } from '../../components/Button';

import { database } from '../../database'
import { SkillModel } from '../../database/models/skillModel';

import { Container, Title, Input, Form, FormTitle } from './styles';

export function Home() {
  const [type, setType] = useState<MenuTypeProps>("soft");
  const [name, setName] = useState('');
  const [skills, setSkills] = useState<SkillModel[]>([]);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleSave = async () => {
    const skillsCollection = database.get<SkillModel>('skills');

    await database.write(async () => {
      await skillsCollection.create(data => {
        data.name = name
        data.type = type
      })
    })

    fetchSkills()
    setName('')
    alert('Skill saved!')
    bottomSheetRef.current.collapse()
  }

  const fetchSkills = async () => {
    const skillsCollection = database.get<SkillModel>('skills');

    const skillsResponse = await skillsCollection
      .query( Q.where('type', type) )
      .fetch()
      
    setSkills(skillsResponse)
  }

  useEffect(() => {
    fetchSkills()
  }, [type])

  return (
    <Container>
      <Title>About me</Title>
      <Menu
        type={type}
        setType={setType}
      />

      <FlatList
        data={skills}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Skill
            data={item}
            onEdit={() => { }}
            onRemove={() => { }}
          />
        )}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['4%', '35%']}
      >
        <Form>
          <FormTitle>New</FormTitle>

          <Input
            placeholder="New skill..."
            onChangeText={setName}
            value={name}
          />

          <Button
            title="Save"
            onPress={handleSave}
          />
        </Form>
      </BottomSheet>
    </Container>
  );
}