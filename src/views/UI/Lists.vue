<template>
  <Widget>
    <template #title>Lists</template>

    <div class="row">
      <div class="col-md-6">
        <h5>To Do</h5>
        <DraggableList v-model="taskList" group="tasks">
          <template #default="{ item }">
            <TaskListItem :item="item" />
          </template>
        </DraggableList>
      </div>
      <div class="col-md-6">
        <h5>Done</h5>
        <DraggableList v-model="taskListDone" group="tasks">
          <template #default="{ item }">
            <TaskListItem :item="item" />
          </template>
        </DraggableList>
      </div>
    </div>
  </Widget>
</template>

<script>
import Widget from '@/components/Widget.vue'
import DraggableList from '@/components/Lists/DraggableList.vue'
import TaskListItem from '@/components/Tasks/TaskListItem.vue'

export default {
  components: {
    Widget,
    DraggableList,
    TaskListItem
  },
  data: () => ({
    taskList: [
      { id: 1, title: 'Returning keys', due_at: '2024-07-16T14:42:01Z', priority: 'high', sort: 1 },
      {
        id: 2,
        title: 'Contract renewal',
        due_at: '2023-12-02T10:13:48Z',
        priority: 'medium',
        sort: 2
      },
      { id: 3, title: 'Clean room', due_at: '2023-07-20T03:25:34Z', priority: 'low', sort: 3 },
      { id: 4, title: 'Prepare report', due_at: '2023-06-11T18:30:05Z', priority: 'high', sort: 4 },
      {
        id: 5,
        title: 'Buy groceries',
        due_at: '2023-10-14T22:11:21Z',
        priority: 'medium',
        sort: 5
      },
      {
        id: 6,
        title: 'Schedule meeting',
        due_at: '2023-04-05T08:49:56Z',
        priority: 'low',
        sort: 6
      },
      { id: 7, title: 'Plan vacation', due_at: '2023-11-07T14:58:07Z', priority: 'high', sort: 7 },
      {
        id: 8,
        title: 'Doctor appointment',
        due_at: '2023-09-09T06:22:13Z',
        priority: 'medium',
        sort: 8
      },
      {
        id: 9,
        title: 'Complete assignment',
        due_at: '2023-05-25T16:45:12Z',
        priority: 'low',
        sort: 9
      },
      { id: 10, title: 'Team building', due_at: '2023-08-03T11:17:35Z', priority: 'high', sort: 10 }
    ],
    taskListDone: []
  })
}
</script>
